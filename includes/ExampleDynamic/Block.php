<?php

namespace IdeasOnPurpose\Blocks\ExampleDynamic;

use Doctrine\Inflector\InflectorFactory;

class Block
{
	public function __construct()
	{
		add_action('init', [$this, 'register']);
	}

	public function register()
	{
		/**
		 * This is a dynamic block, so we need to append the render_callback
		 * to the block object returned from register_block_type.
		 */
		$json_path = __DIR__ . '/../../build/example-dynamic/block.json';
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
		$date = date($attributes['format']);

		$inflector = InflectorFactory::create()->build();
		$label = $inflector->singularize('dates');

		return "<div {$wrapper_attributes}>Example Dynamic ({$label}) Block: <strong>{$date}</strong></div>";
	}
}
