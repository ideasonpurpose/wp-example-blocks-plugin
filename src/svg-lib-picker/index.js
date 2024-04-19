import beaker from './lib/BeakerAnimated';
// import SvgBeakerAnimated from './lib/BeakerAnimated.js';
import icon from './lib/beaker-animated.svg';

import { registerBlockType } from '@wordpress/blocks';

import { Edit as edit } from './edit';

import './styles.scss';

console.log('svg-lib: index.js');
console.log('svg-lib/index.js', beaker, icon);

registerBlockType('ideasonpurpose/svg-lib-picker', {
	edit,
	icon: beaker,
});
