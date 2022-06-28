import { ToggleControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

console.log('lib/input-fields');

export const InputFields = () => {
	const { postType } = useSelect((select) => {
		return {
			postType: select('core/editor').getCurrentPostType(),
		};
	}, []);

	const [meta, setMeta] = useEntityProp('postType', postType, 'meta');

	const updateMetaAltTitle = (newAltTitle) => {
		console.log({ newAltTitle });
		/**
		 * This example saves the new value into two meta fields:
		 * - `headline` is an ACF field (ACF Fields are always arrays)
		 * - `iop_altHeadline` is our own custom field
		 * The ACF input field must be disabled, otherwise it will overwrite
		 * the Block Editor value when saving.
		 */
		setMeta({
			...meta,
			headline: [newAltTitle],
			iop_altHeadline: newAltTitle,
		});
	};

	const updateToggle = (val) => {
		/**
		 * The ToggleControl component sends its value AFTER interaction. This makes
		 * updates very easy, just set the metadata to whatever val is.  of breaks the responsive model:
		 * just use val to set whatever this is bound to.
		 *
		 * Otherwise, we can just ignore the input altogether and twiddle the
		 * bound values.
		 */

		// Either of these will work:
		const newVal = val;
		// const newVal = !meta.iop_toggle;
		setMeta({
			...meta,
			iop_toggle: newVal,
			iop_test: 'updateToggle toggle from InputFields',
		});
	};

	return (
		<>
			<TextControl
				label="Alternate Page Title (from ACF)"
				value={meta.iop_altHeadline}
				placeholder="Enter an alternate title"
				onChange={updateMetaAltTitle}
			/>

			<ToggleControl
				label="InputFields Toggle Component!!"
				checked={!!meta.iop_toggle}
				onChange={updateToggle}
			/>
		</>
	);
};
