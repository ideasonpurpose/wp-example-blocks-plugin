import { registerBlockType } from '@wordpress/blocks';

import { Edit as edit } from './edit';

import './styles.scss';

registerBlockType('ideasonpurpose/example-dynamic', {
	edit,
});
