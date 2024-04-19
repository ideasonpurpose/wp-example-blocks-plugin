<?php

namespace IdeasOnPurpose\Blocks\SvgLibPicker;

class Block
{
	public function __construct()
	{
		error_log('loaded SVG Picker');
		add_action('init', [$this, 'register']);
	}

	public function register()
	{
		$json_path = __DIR__ . '/../../build/svg-lib-picker/block.json';
		$block = register_block_type($json_path);
		$block->render_callback = [$this, 'render'];
	}

	public function render($attributes, $content)
	{
		/**
		 * Note: get_block_wrapper_attributes() returns a string of block attributes (class & style)
		 * ready to inject into a tag:
		 *
		 *   class="is-style-default wp-block-example" style="text-decoration: underline"
		 *
		 * {@link https://developer.wordpress.org/reference/functions/get_block_wrapper_attributes/}
		 */
		$wrapper_attributes = get_block_wrapper_attributes();

		return "<div {$wrapper_attributes}>SHOW SVG HERE</div>";
	}
}
