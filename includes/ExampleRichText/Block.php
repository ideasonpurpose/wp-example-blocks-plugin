<?php

namespace IdeasOnPurpose\Blocks\ExampleRichText;

class Block
{
	public function __construct()
	{
		add_action("init", [$this, "register"]);
	}

	public function register()
	{
		$json_path = __DIR__ . "/../../build/example-rich-text/block.json";
		register_block_type($json_path);
	}
}
