<?php
/**
 * Plugin Name:       IOP Example Blocks
 * Plugin URI:        https://github.com/ideasonpurpose
 * Description:       Plugin shell for our example blocks
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Version:           1.0.2
 * Author:            Ideas On Purpose
 * License:           ISC
 * License URI:       https://opensource.org/licenses/isc-license.txt
 * Text Domain:       iop-blocks
 * Update URI:        https://iop-aws-update-endpoint.com
 *
 * @package           ideasonpurpose-blocks
 */

namespace IdeasOnPurpose;

require __DIR__ . "/vendor/autoload.php";

/**
 * Each Block registers itself on init, so there's no need to wrap these instantiations
 * in a hook.
 *
 * Assets are all being loaded from block.json attributes
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

new Blocks\ExampleRichText\Block();
new Blocks\ExampleDynamic\Block();
new Blocks\ExampleMetaSidebar\Block();
