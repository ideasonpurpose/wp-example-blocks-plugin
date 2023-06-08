// @ts-check

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	FormTokenField,
} from '@wordpress/components';

import { useMemo, useState, useEffect } from '@wordpress/element';

import { useSelect } from '@wordpress/data';

import { store as coreStore } from '@wordpress/core-data';

import {
	at,
	map,
	find,
	filter,
	get,
	pick,
	slice,
	shuffle,
	sampleSize,
} from 'lodash';

/**
 * GLOBAL DEBUGGING COUNTER
 */
const calls = {
	// getPostTypeObject: 0,
	getTaxonomyTerms: 0,
	somePostsMap: 0,
	useTaxonomies: 0,
	cardTermsFilter: 0,
	postTypes: 0,
};

/**
 * Lifted more-or-less directly from the undocumented usePublicPostTypes() here:
 * https://github.com/WordPress/gutenberg/blob/ca2db4f1380210fee72057ec4e1b0b0c9b4d358d/packages/edit-site/src/components/add-new-template/utils.js#L136-L148
 *
 * We might also be able to use the usePostTypes() helper in query/utils:
 * https://github.com/WordPress/gutenberg/blob/3383af2e4a6547987db2186f18d45b34b60e8543/packages/block-library/src/query/utils.js#L72-L105
 */
const usePublicPostTypes = () => {
	const postTypes = useSelect(
		(select) => select(coreStore).getPostTypes({ per_page: -1 }),
		[]
	);
	console.log('in usePublicPostTypes');
	return useMemo(() => {
		const excludedPostTypes = ['attachment'];
		console.log('in usePublicPostTypes memo');

		return postTypes?.filter(
			({ viewable, slug }) => viewable && !excludedPostTypes.includes(slug)
		);
	}, [postTypes]);
};

/**
 *
 * Modified from query/utils:
 * https://github.com/WordPress/gutenberg/blob/3383af2e4a6547987db2186f18d45b34b60e8543/packages/block-library/src/query/utils.js#L107-L127
 */
const useTaxonomies = (postType) => {
	console.log('useTaxonomies outer');

	const taxonomies = useSelect((select) => {
		// const { getTaxonomies } = select(coreStore);
		return select(coreStore).getTaxonomies({
			type: postType,
			per_page: -1,
			context: 'view',
		});
	});

	return taxonomies;
	// return useMemo(() =>
	// 	getTaxonomies({
	// 		type: postType,
	// 		per_page: -1,
	// 		context: 'view',
	// 	})
	// )[postType];

	// 	const filteredTaxonomies = getTaxonomies({
	// 		type: postType,
	// 		per_page: -1,
	// 		context: 'view',
	// 	});
	// 	return filteredTaxonomies;
	// },
	// [postType]
	// );
	// return taxonomies || [];
	// const filteredTaxonomies = useSelect(
	// 	(select) =>
	// 		select(coreStore).getTaxonomies({
	// 			type: postType ,
	// 			per_page: -1,
	// 			context: 'view',
	// 		}),
	// 	[postType]
	// );
	// calls.useTaxonomies++;
	// console.log('useTaxonomies:', filteredTaxonomies, calls);

	// return filteredTaxonomies || [];
	// }, [post_type]);
	// return taxonomies;
};

// /**
//  *
//  * @param Lifted directly from query/utils:
//  * https://github.com/WordPress/gutenberg/blob/3383af2e4a6547987db2186f18d45b34b60e8543/packages/block-library/src/query/utils.js#L107-L127
//  *
//  * Note: Moved into Edit and refactored to get memoization working correctly
//  */
// const useTaxonomies = (postType) => {
// 	const taxonomies = useSelect(
// 		(select) => {
// 			calls.useTaxonomies++;
// 			console.log('useTaxonomies:', postType, calls);

// 			const { getTaxonomies } = select(coreStore);
// 			const filteredTaxonomies = getTaxonomies({
// 				type: postType,
// 				per_page: -1,
// 				context: 'view',
// 			});
// 			return filteredTaxonomies;
// 		},
// 		[postType]
// 	);
// 	return taxonomies;
// };

/**
 * TODO: Get more than 100 terms (paged result)
 *
 * NOTE: Moved into Edit() to get memoization working correctly
 */
// const getTaxonomyTerms = (taxonomy) => {
// 	const terms = useSelect(
// 		(select) => {
// 			calls.getTaxonomyTerms++;
// 			console.log('getTaxonomyTerms:', taxonomy, calls);
// 			return select('core').getEntityRecords('taxonomy', taxonomy, {
// 				per_page: -1,
// 			});
// 		},
// 		[taxonomy]
// 	);
// 	return terms;
// };

// NOTE: Moved into Edit()
//
// const getPostTypeObject = (slug) => {
// 	return useSelect(
// 		(select) => {
// 			calls.getPostTypeObject++;
// 			console.log('getPostTypeObject:', slug, calls);
// 			return select(coreStore).getPostType(slug);
// 		},
// 		[slug]
// 	);
// };

export const Edit = (props) => {
	const { attributes, className, setAttributes } = props;
	/**
	 * useBlockProps: Additional props will be merged and returned
	 * This didn't have the full className, maybe because there's no save method?
	 * Passing {className: 'foo'} merged it so everything works as expected
	 * {@link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops}
	 */
	const blockProps = useBlockProps({ className });

	const { post_type, count, tax_filter, terms_filter } = attributes;

	/**
	 * universal handler for input controls
	 *
	 * @global postTypes is
	 */
	const onChangeValidate = (values) => {
		console.log({ method: 'onChangevalidate', values, attributes });

		const { post_type, tax_filter, terms_filter } = {
			...attributes,
			...values,
		};

		// const new_post_type = post_type;

		// setTaxonomies(useTaxonomies(post_type));
		// const taxonomies = postTypes.reduce(
		// 	(tax, p) => (p.slug === post_type && p.taxonomies ? p.taxonomies : tax),
		// 	[]
		// );
		const taxonomies = [];

		// GET TAXONOMIES WITYHOUT ASSUMING THE POSTTYPE WAS FOUND

		console.log(postTypes, taxonomies);
		// const taxonomies = at(find(postTypes, { slug: post_type }), 'taxonomies');
		// console.log(taxonomies);
		const new_tax_filter = taxonomies.includes(tax_filter)
			? tax_filter
			: taxonomies.shift();

		const new_terms_filter = terms_filter.filter((name) => {
			return find(terms, { name })?.taxonomy === new_tax_filter;
		});

		setAttributes({
			post_type,
			tax_filter: new_tax_filter,
			terms_filter: new_terms_filter,
		});
	};

	/**
	 * Batching useSelect for use in functions immediately following this
	 */
	const { getEntityRecords, getMedia } = useSelect((select) => {
		return {
			// getPostType: select(coreStore).getPostType,
			// getTaxonomies: select(coreStore).getTaxonomies,
			getMedia: select(coreStore).getMedia,
			getEntityRecords: select('core').getEntityRecords,
		};
	});

	/**
	 * Moved this in here from outside the Edit function to get memoizing working correctly
	 */
	// const getPostTypeObject = (slug) => {
	// 	// return useMemo(() => {
	// 	calls.getPostTypeObject++;
	// 	console.log('getPostTypeObject:', slug, calls);
	// 	return getPostType(slug);
	// 	// }, [slug]);
	// };

	/**
	 * Moved this in here from outside Edit() to get memoizing working correctly
	 */
	const getTaxonomyTerms = (taxonomy) => {
		console.log({ taxonomy });
		// return useMemo(() => {
		calls.getTaxonomyTerms++;
		console.log('getTaxonomyTerms:', taxonomy, calls);
		const terms = getEntityRecords('taxonomy', taxonomy, { per_page: -1 });
		console.log({ method: 'getTaxonomyTerms', terms });
		return terms || []; // undefined values are worthless here
		// }, [taxonomy]);
	};

	/// TODO: Do these need to be state variables?
	const postTypes = usePublicPostTypes();
	// const postTypeObject = getPostTypeObject(post_type);
	// const taxonomies = useTaxonomies(post_type);
	// const 	taxonomies = [];

	// const [taxonomies, setTaxonomies] = useState([]);
	// const terms = getTaxonomyTerms(tax_filter) ?? [];

	const [terms, setTerms] = useState([]);

	/**
	 * Request initial values on first load (empty deps array only calculates once)
	 */
	// useMemo(() => {
	// 	// setTaxonomies(useTaxonomies(post_type));
	// 	setTerms(getTaxonomyTerms(tax_filter));
	// }, []);

	const [disableTaxFilters, setDisableTaxFilters] = useState(false);

	// setTerms(getTaxonomyTerms(tax_filter))

	// if (postTypeObject) {
	// 	for (let n = 0; n < count; n++) {
	// 		content[n] = (
	// 			<div key={'card' + n}>
	// 				{postTypeObject?.labels.singular_name} #{n + 1}
	// 			</div>
	// 		);
	// 	}
	// }

	// const query = { per_page: -1 };
	// query[tax_filter] = filter(terms, (o) => terms_filter.includes(o.name)).map(
	// 	(o) => o.id
	// );

	// console.log({ query });
	// query[tax_filter] = filter(terms, (o) => terms_filter.includes(o.name)).map(o => o.slug);
	// const posts = useMemo(() => {
	// 	const query = { per_page: -1 };
	// 	// Ensure the current term is valid for the postType (duplicated terms should persist across different taxonomies )
	// 	query[tax_filter] = filter(terms, (tax) =>
	// 		terms_filter.includes(tax.name)
	// 	).map((o) => o.id);

	// 	const allPosts = getEntityRecords('postType', post_type, query);

	// 	// const somePosts = slice(allPosts, 0, count)
	// 	const somePosts = sampleSize(allPosts, count).map((post) => {
	// 		calls.somePostsMap++;
	// 		console.log('somePostsMap:', post.id, calls);
	// 		post._media = getMedia(post.featured_media);
	// 		return post;
	// 	});

	// 	return somePosts;
	// }, [post_type, tax_filter, terms_filter]);

	// // sampleSize(posts, count).forEach((post) =>{
	// posts?.forEach((post) => {
	// 	// const media = useSelect((select) =>
	// 	// 	select(coreStore).getMedia(post.featured_media)
	// 	// );
	// 	// const sizes = get(media, ['media_details', 'sizes']);
	// 	const sizes = get(post, ['_media', 'media_details', 'sizes']);

	// 	const src =
	// 		get(sizes, ['medium_large', 'source_url']) ||
	// 		get(sizes, ['thumbnail', 'source_url']);

	// 	content.push(
	// 		<div key={post.id}>
	// 			<img src={src} width="240" height="180" />

	// 			<h2>{post.title.raw}</h2>
	// 			<p>{post.excerpt.raw}</p>
	// 		</div>
	// 	);
	// });

	const cards = () => {
		// console.log({ post_type, terms_filter, tax_filter, terms: terms.length });

		// const posts = useMemo(() => {
		const query = useMemo(() => {
			const q = { per_page: -1 };
			// Ensure the current term is valid for the postType (duplicated terms should persist across different taxonomies )
			// TODO: This would be more efficient the other way, loop over any existing names in terms_filter and compare with terms[].name
			q[tax_filter] = filter(terms, (tax) => {
				calls.cardTermsFilter++;
				// console.log('cardTermsFilter', {
				// 	name: tax.name,
				// 	terms_filter,
				// 	tax_filter,
				// });
				return terms_filter.includes(tax.name);
			}).map((term) => term.id);
			// console.log({ q });
			return q;
		}, [post_type, terms, tax_filter]);

		const allPosts = getEntityRecords('postType', post_type, query);
		// const allPosts = getEntityRecords('postType', post_type, { per_page: -1 });
		const somePosts = useMemo(() => shuffle(allPosts), [allPosts]).slice(
			0,
			count
		);

		// const somePosts = slice(allPosts, 0, count)

		// TODO: use memoized shuffle instead of sampleSize so changing count doesn't produce a different set.
		// TODO: Memoize with the current minute (0-59) /2  (floor) to randomize every two minutes
		// const somePosts = sampleSize(allPosts, count).map((post) => {
		// 	calls.somePostsMap++;
		// 	// console.log('somePostsMap:', post.id, calls);
		// 	post._media = getMedia(post.featured_media);
		// 	return post;
		// });

		// return somePosts;
		// }, [terms]);

		const cards = somePosts.map((post) => {
			const media = getMedia(post.featured_media);

			// const { sizes, height, width } = pick(media, [
			const [sizes, height, width] = at(media, [
				'media_details.sizes',
				'media_details.height',
				'media_details.width',
			]);
			// const sizes = get(media, ['media_details', 'sizes']);
			// console.log({
			// 	featured: post.featured_media,
			// 	media,
			// 	sizes,
			// 	height,
			// 	width,
			// });
			// const { height, width } = pick(media, [
			// 	'media_details.sizes',
			// 	'media_details.height',
			// 	'media_details.width',
			// ]);

			// TODO: Need to handle missing sizes when medium_large is not available
			const src = get(sizes, ['thumbnail', 'source_url']);

			return <div key={post.id}>{post.title.raw}</div>;
			// return (
			// 	<div key={post.id}>
			// 		<img src={src} width="240" height={(height / width) * 240 || 240} />

			// 		<h2>{post.title.raw}</h2>
			// 		<p>{post.excerpt.raw}</p>
			// 	</div>
			// );
		});

		console.log({ somePosts, cards, calls });
		return cards;
	};

	// const [taxOptions, setTaxOptions] = useState([]);
	// let disableTaxFilters = false;
	// const taxOptions = useTaxonomies(post_type)?.map((tax) => ({

	// useMemo(() => {
	// 	setDisableTaxFilters(false);

	// 	setTaxOptions(
	// 		taxonomies.map((tax) => ({
	// 			value: tax.slug,
	// 			label: tax.name,
	// 		}))
	// 	);
	// 	if (!taxonomies.length) {
	// 		setDisableTaxFilters(true);
	// 		setTaxOptions([
	// 			{
	// 				value: '',
	// 				// label: 'No taxonomies for ' + postTypeObject?.name,
	// 			},
	// 		]);
	// 	}
	// }, [taxonomies]);

	// return <h1 {...blockProps}>BAIL</h1>;

	// const taxOptions = taxonomies.map((tax) => ({
	// 	value: tax.slug,
	// 	label: tax.name,
	// }));

	// if (taxOptions?.length === 0) {
	// 	// disableTaxFilters = true;
	// 	setDisableTaxFilters(true)
	// 	taxOptions.push({
	// 		value: '',
	// 		label: 'No taxonomies for ' + postTypeObject?.name,
	// 	});
	// }

	// console.log({
	// 	disableTaxFilters,
	// 	taxOptions,
	// 	terms: map(terms, 'name'),
	// 	calls,
	// });

	// setDisableTaxFilters(true);

	const postTypeOptions = () =>
		useMemo(() => {
			if (!postTypes?.length)
				return [{ label: 'Loading PostTypes...', value: '' }];
			return postTypes.map((f) => ({ value: f.slug, label: f.name }));
		}, [postTypes]);

		/**
		 * taxOptions returns an option-list of
		 * @returns {Object[] | null}
		 */
	const taxOptions = () => {
		const taxonomies = useTaxonomies(post_type);
		console.log({ msg: 'in taxOptions', post_type, taxonomies });

		// handle loading
		if (taxonomies === null) {
			return [{ label: 'Loading Taxonomies...', value: '' }];
		}

		// handle zero count
		if (taxonomies?.length == 0) {
			return [{ label: 'No Taxonomies for ' + post_type, value: '' }];
		}
		return taxonomies.map((tax) => ({ value: tax.slug, label: tax.name }));
	};

	const termSuggestions = () =>
		useMemo(() => {
			console.log('termSuggestions useMemo');
			// // handle loading
			// if (false) {
			return [{ label: 'Loading Terms...', value: '' }];
			// }

			console.log({ post_type, tax_filter });

			// TODO: Any undefined values returned as a suggestion will throw errors from FormTokenField

			return ['doggo', 'cat', 'froggy', 'bird', 'lizard', 'llama', post_type];
		}, [post_type, tax_filter]);

	return (
		<div {...blockProps}>
			<InspectorControls key="setting">
				<PanelBody title={'Random Cards'}>
					<SelectControl
						label="Post Type"
						value={post_type}
						disabled={!postTypes?.length}
						options={postTypeOptions()}
						onChange={(val) => onChangeValidate({ post_type: val })}
					/>

					<RangeControl
						label="Cards to show"
						value={count}
						onChange={(count) => setAttributes({ count })}
						min={1}
						max={10}
					/>

					<SelectControl
						label="Taxonomy Filter"
						value={tax_filter}
						disabled={disableTaxFilters}
						options={taxOptions()}
						onChange={(val) => onChangeValidate({ tax_filter: val })}
					/>

					<FormTokenField
						label="Taxonomy Terms Filter"
						disabled={disableTaxFilters}
						onChange={(val) => onChangeValidate({ terms_filter: val })}
						suggestions={termSuggestions()}
						value={terms_filter}
					/>
				</PanelBody>
			</InspectorControls>
			<div>Hello</div>
		</div>
	);
};
