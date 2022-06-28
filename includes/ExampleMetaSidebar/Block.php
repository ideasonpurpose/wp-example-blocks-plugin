<?php

namespace IdeasOnPurpose\Blocks\ExampleMetaSidebar;

class Block
{
	public function __construct()
	{
		add_action("init", [$this, "register"]);
		add_action("init", [$this, "meta"]);
	}

	public function register()
	{
		$json_path = __DIR__ . "/../../build/example-meta-sidebar/block.json";
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
		$meta_args = ["single" => true, "show_in_rest" => true];
		register_post_meta("page", "iop_toggle", array_merge($meta_args, ["type" => "boolean"]));
		register_post_meta("page", "iop_altHeadline", $meta_args);
		register_post_meta("page", "iop_test", $meta_args);
		register_post_meta("", "headline", ["show_in_rest" => true]);
	}
}
