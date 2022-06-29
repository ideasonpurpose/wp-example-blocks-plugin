import { RichText, useBlockProps } from '@wordpress/block-editor';

export const save = (props) => {
	const blockProps = useBlockProps.save();

	return (
		<RichText.Content
			{...blockProps}
			tagName="div"
			value={props.attributes.message}
		/>
	);
};
