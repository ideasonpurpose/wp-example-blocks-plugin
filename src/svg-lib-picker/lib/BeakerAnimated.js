import * as React from 'react';
const SvgBeakerAnimated = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={390}
		height={500}
		fill="none"
		stroke="currentColor"
		strokeMiterlimit={10}
		strokeWidth={2}
		viewBox="0 0 39 50"
		{...props}
	>
		<path d="m20.859 17.188-2.65 5.125L3.813 31.83c-2.57 1.7-2.377 5.563.34 6.994l17.944 9.456c2.723 1.431 5.966-.618 5.88-3.718l-.495-17.37 2.649-5.124" />
		<path d="m35.446 19.802-15.792-8.323a2.218 2.218 0 0 0-3.006.954 2.26 2.26 0 0 0 .944 3.036l15.792 8.322a2.218 2.218 0 0 0 3.007-.954 2.26 2.26 0 0 0-.945-3.035ZM2.32 33.606a2.595 2.595 0 0 1 1.715-.644 2.63 2.63 0 0 1 1.87.782 2.635 2.635 0 0 0 1.875.781c.68 0 1.362-.262 1.875-.781a2.63 2.63 0 0 1 3.745 0c.52.519 1.195.781 1.875.781a2.62 2.62 0 0 0 1.87-.781 2.634 2.634 0 0 1 1.875-.782c.681 0 1.362.263 1.876.782a2.631 2.631 0 0 0 3.744 0 2.629 2.629 0 0 1 3.008-.519" />
		<path
			strokeLinecap="round"
			d="M28.651 9.656V9.65"
			style={{
				transformOrigin: '50% 50%',
				animation: 'wiggle .2s infinite',
			}}
		/>
		<path
			strokeLinecap="round"
			d="M26.336 4.825v-.013"
			style={{
				animationDelay: '50ms',
				animationDuration: '275ms',
				transformOrigin: '50% 50%',
				animation: 'wiggle .2s infinite',
			}}
		/>
		<path
			strokeLinecap="round"
			d="M30.26 1.256V1.25"
			style={{
				animationDelay: '120ms',
				animationDuration: '333ms',
				transformOrigin: '50% 50%',
				animation: 'wiggle .2s infinite',
			}}
		/>
		<style>
			{
				'@keyframes wiggle{0%,to{transform:translateX(2%)}50%{transform:translateX(-2%)}}'
			}
		</style>
	</svg>
);
export default SvgBeakerAnimated;
