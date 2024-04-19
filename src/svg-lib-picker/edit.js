import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, DropdownMenu } from '@wordpress/components';

// ref: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/#get-with-query-args
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import { useMemo, useState, useEffect } from '@wordpress/element';

import { useSelect } from '@wordpress/data';

import { store as coreStore } from '@wordpress/core-data';

import beaker from './lib/BeakerAnimated';
// import icon from './lib/beaker-animated.svg'; // imports as base64 blob
import { src as puzzle } from './lib/puzzle.json';

let i = 0;
// let svgLib = ['beaker', 'logo', 'rocket', 'atom', 'basketball'];
let svgLib = null;

const getSvgLib = () => {
	console.log({ msg: 'in getSvgLib' });
	apiFetch({ path: '/ideasonpurpose/v1/svg' }).then((svgs) => (svgLib = svgs));
	console.log({ svgLib });
	// return svgLib;
};

export const Edit = (props) => {
	const { attributes, className, setAttributes } = props;
	/**
	 * useBlockProps: Additional props will be merged and returned
	 * This didn't have the full className, maybe because there's no save method?
	 * Passing {className: 'foo'} merged it so everything works as expected
	 * {@link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops}
	 */
	const blockProps = useBlockProps({ className });

	const { format } = attributes;
	const { svgLabel } = attributes;
	const onChangeSelect = (newValue) => setAttributes({ format: newValue });
	const onDropDownSelect = (newVal) => setAttributes({ svgLabel: newVal });

	// const svgLib = ['beaker', 'logo', 'rocket', 'atom', 'basketball'];

	const formatOption = (f) => {
		return { value: f, label: f };
	};

	// TODO: How to get this into the SelectControl?
	// apiFetch({ path: addQueryArgs('/ideasonpurpose/v1/svg', []) }).then(
	// 	(svgs) => {
	// 		consol	e.log(svgs);
	// 		// Object.keys(svgs).forEach(svg => {
	// 		// 	svgLib.push(svg);

	// 		// });
	// 	}
	// );
	getSvgLib();

	const svgKeys = () => {
		// console.log({ msg: 'in svgKeys' });
		// const svgLib =  getSvgLib();
		console.log({ keys: 'in svgKeys', svgLib });

		// handle loading
		if (svgLib === null) {
			return [{ label: 'Loading SVGs...', value: '' }];
		}

		// handle zero count
		if (Object.keys(svgLib).length == 0) {
			return [{ label: 'No Registered SVGs' }];
		}
		let out = Object.keys(svgLib);
		console.log({ out });
		// out = out.push('dog' + i++);
		out = out.map(formatOption);
		console.log(out);
		return out;
	};

	const renderSvg = (slug, props) => {
		console.log('in renderSvg', slug);
		if (svgLib && svgLib[slug]) {
			// TODO: Likely will need to recreate some of the wp-svg-lib dimensions stuff here for handling aspect and 'auto'

			props.height = props.width / svgLib[slug].aspect;
			props = { ...props, ...svgLib[slug].attributes };
			return (
				<svg
					{...props}
					dangerouslySetInnerHTML={{ __html: svgLib[slug].innerContent }}
				/>
			);
		}
		return <span>SVG Block</span>;
	};

	// const svgLib = Object.keys(await apiFetch({ path:  '/ideasonpurpose/v1/svg' } ));

	// options={svgLib.map(formatOption)}
	//
	// console.log(svgLib.map(formatOption));
	return (
		<div {...blockProps}>
			<InspectorControls key="setting">
				<PanelBody title={'Format'}>
					<SelectControl
						label="SVG Icon"
						value={format}
						options={svgKeys()}
						onChange={onChangeSelect}
					/>
					<DropdownMenu
						icon={beaker({ width: 39, height: 50 })}
						label="this is label"
						title="this is the title"
						text={svgLabel}
						controls={[
							{
								title: 'Beaker',
								icon: beaker({ width: 25, height: 30 }),
								onClick: () => onDropDownSelect('Beaker'),
							},
							{
								title: 'Puzzle',
								icon: <span dangerouslySetInnerHTML={{ __html: puzzle }} />,
								onClick: () => onDropDownSelect('Puzzle'),
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
			<div>
				{format}
				{renderSvg(format, { width: 70 })}
			</div>
		</div>
	);
};
