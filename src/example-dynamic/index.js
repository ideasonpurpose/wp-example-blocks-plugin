import { registerBlockType } from '@wordpress/blocks';

import { Edit as edit } from './edit';

import './styles.scss';

console.log('example-dynamic: index.js');

registerBlockType('ideasonpurpose/example-dynamic', {
	edit,
});
