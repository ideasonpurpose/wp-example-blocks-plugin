import { registerBlockType } from '@wordpress/blocks';

import { Edit as edit } from './edit';

import './styles.scss';

console.log('random-cards: index.js');

registerBlockType('ideasonpurpose/random-cards', {
	edit,
});
