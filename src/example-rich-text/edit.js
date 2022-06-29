import { RichText, useBlockProps } from '@wordpress/block-editor';

export const Edit = (props) => {
	const blockProps = useBlockProps();
	const { attributes, setAttributes } = props;

	const onChangeContent = (newContent) => {
		setAttributes({ message: newContent });
	};

	return (
		<RichText
			{...blockProps}
			tagName="div"
			onChange={onChangeContent}
			value={attributes.message}
			placeholder="RichText placeholder content"
		/>
	);
};
