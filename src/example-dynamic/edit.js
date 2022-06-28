import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

import { date } from '@wordpress/date';

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
	const onChangeSelect = (newValue) => setAttributes({ format: newValue });

	const formats = [
		'r',
		'Y-m-d H:i:s',
		'd/m/Y H:i:s',
		'g:ia \\o\\n l jS F Y',
		'D M j G:i:s T Y',
	];

	const formatDate = (f) => {
		return { value: f, label: date(f) };
	};

	return (
		<div {...blockProps}>
			<InspectorControls key="setting">
				<PanelBody title={'Format'}>
					<SelectControl
						label="Date Format"
						value={format}
						options={formats.map(formatDate)}
						onChange={onChangeSelect}
					/>
				</PanelBody>
			</InspectorControls>
			{date(format)}
		</div>
	);
};
