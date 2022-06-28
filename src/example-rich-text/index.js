import { registerBlockType } from '@wordpress/blocks';

import { Edit as edit } from './edit';
import { save } from './save';

import './styles.scss';

registerBlockType('ideasonpurpose/example-rich-text', {
	edit,
	save,
});
