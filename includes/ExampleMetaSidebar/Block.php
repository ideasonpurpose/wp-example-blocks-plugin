<?php

namespace IdeasOnPurpose\Blocks\ExampleMetaSidebar;

class Block
{
	public function __construct()
	{
		add_action('init', [$this, 'register']);
		add_action('init', [$this, 'meta']);
	}

	public function register()
	{
		/**
		 * Trying to load this plugin into the new Widgets Block Editor throws this error:
		 *
		 *      Notice: Function wp_enqueue_script() was called incorrectly. "wp-editor" script should not
		 *      be enqueued together with the new widgets editor (wp-edit-widgets or wp-customize-widgets).
		 *      Please see Debugging in WordPress for more information.
		 *      (This message was added in version 5.8.0.) in /var/www/html/wp-includes/functions.php on line 5831
		 *
		 * The problem is that the `PluginDocumentSettingPanel` component in @wordpress/edit-post tries to load the
		 * post-editor libraries alongside the widget editor. For whatever reason, those appear to be incompatible.
		 *
		 * A number of other third-party plugins have also bumped into this:
		 * https://github.com/search?q=wp_enqueue_script+incorrectly+wp-editor+enqueued+new+widgets+editor&type=issues
		 *
		 * The solution is kind of ugly, we check the $pagenow global, and return early without registering if it
		 * matches the widget editor (widgets.php). Hopefully something more elegant will become available.
		 *
		 * Tested against 2022-06  WordPress v6.0.0
		 */
		global $pagenow;
		if ($pagenow == 'widgets.php') {
			return;
		}

		$json_path = __DIR__ . '/../../build/example-meta-sidebar/block.json';
		register_block_type($json_path);
	}

	public function meta()
	{
		/**
		 * @link https://developer.wordpress.org/reference/functions/register_post_meta/
		 * @link https://developer.wordpress.org/reference/functions/register_meta/
		 * @link https://make.wordpress.org/core/2018/07/27/registering-metadata-in-4-9-8
		 *
		 * Note that we need meta_keys to always be available to the REST API, and
		 * generally always single items, so we set up a default set of `$meta_args`
		 *
		 * Also, in an attempt to future-proof this data, we loosely namespace
		 * the meta_keys by prefixing with 'iop_'
		 */
		$meta_args = ['single' => true, 'show_in_rest' => true];
		register_post_meta(
			'page',
			'iop_toggle',
			array_merge($meta_args, ['type' => 'boolean'])
		);
		register_post_meta('page', 'iop_altHeadline', $meta_args);
		register_post_meta('page', 'iop_test', $meta_args);
		register_post_meta('', 'headline', ['show_in_rest' => true]);
	}
}
