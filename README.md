# IOP Example Blocks Plugin

This project was initially scaffolded with `npx @wordpress/create-block`, the resulting plugin includes the following example blocks:

### RichText Block

This block is entirely JavaScript. Formatting options are provided by [Block Supports](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/block-supports-in-static-blocks/).

> _TODO: Exiting this block is not as easy as native blocks like [Paragraph](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-library/src/paragraph/edit.js), [Quote](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-library/src/quote/edit.js) or [List](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-library/src/list/edit.js). Check [`RichText onSplit()`](https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/rich-text/README.md#onsplit-value-string--function) for ways to improve this._

### Dynamic Block

A basic dynamic block, this renders the current date from PHP using a format selected from the Block Editor. Supports colors and alignment via [Block Supports](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/block-supports-in-static-blocks/).

This block uses a Composer autoloaded PHP library to process dynamic text before printing output.

The sidebar pulldown selector provides formatting choices for the dynamic date string.

### Document-level Metadata Block Editor Plugin

This plugin adds two alternate metadata interfaces to the Block Editor. First, a  Plugin Document Settings Panel is added to the list of Document attribute input. Second, a totally separate  Plugin Sidebar  and more-menu item provide the same options in a different place. 

, but everyone agreed it was too hidden and easily forgotten.  alternate interfaces for saving metadata to the currently edited post. These interfaces are completely interchangeable, values entered in one can be modified in the other. Values are not saved until the post is updated.

The two interfaces:

- A [Document Settings Panel](https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-document-setting-panel/) under the Document (Page) Settings tab.
- A [Plugin Sidebar](https://developer.wordpress.org/block-editor/how-to-guides/plugin-sidebar-0) with an action-menu entry and logo-button next to the Update button.

My preference is the Document Settings Panel. This feels better integrated into the regular Block Editor experience, and is easily found and understood. The Plugin Sidebar introduces a completely new editing area which could be easily missed or forgotten about.

## Block code Layout

The core of current WordPress Block development is the **block.json** file, which is referenced from both PHP and JavaScript. Because of this, the JSON file must exist in the compiled output at a path relative to the JS files, but also somewhere known to PHP.

Since PHP is not processed, the plugin's source is separated into two like-named directories, one for PHP and one for processed assets like JS, SCSS and JSON.

The file tree of most blocks then looks something like this:

- includes/
  - **BlockName/** - _PHP_
    - **Block.php** - initializes the block from PHP, and any other needed stuff
- src/
  - **block-name/** - _JavaScript_
    - **block.json** - the main config file, also referenced from PHP
    - **index.js** - Referenced from block.json's `editorScript`
    - **edit.js** - The block's `edit` function and supporting code
    - **view.js** - Scripts for the front-end only, should import styles.
    - **styles.scss** - Block specific styles

### Loading Assets

For plugins, asset loading is mostly automated away thanks to `@wordpress/scripts` finding every **block.json** file _anywhere_ in the src directory, then registering all referenced assets.

## Notes

Random stuff and notes about poorly documented features

### @wordpress dependencies

The [@wordpress/dependency-extraction-webpack-plugin](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/) is a bit of a hack that sits on top of webpack externals and omits a subset of known scripts which are included with WordPress. Support for this plugin was added to our build toolchain in [docker-build v0.12.0](https://github.com/ideasonpurpose/docker-build/blob/master/CHANGELOG.md#v0120) and [wp-theme-init v2.7.0](https://github.com/ideasonpurpose/wp-theme-init/blob/master/CHANGELOG.md#v270), which now recognizes the plugin's `*.asset.php` snippet files.

While most all **@wordpress** scripts are available via the `wp` global, including these dependencies in development enables VS Code's JS-Intellisense helpers and creates a much more specific set of dependencies when including the scripts.

### Misc.

- [**`get_block_wrapper_attributes`**](https://developer.wordpress.org/reference/functions/get_block_wrapper_attributes) - returns a string of block attributes (class & style)

* [**`useBlockProps`**](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops) - Sometimes this will not include the full container className, but it will merge and return any arguments passed to it. Not sure why it would be missing the className, maybe this only happens for dynamic blocks where there's no save method?

### Accessing ACF fields from post_meta

While its values are stored in standard post_meta and can be retrieved with `get_post_meta`, using ACF values from the Block API requires a few additional considerations.

When enabled, the ACF plugin adds an `acf` attribute to the Post object. That attribute contains a key-value map of any defined ACF values. These can be accessed like this:

```js
wp.data.select('core/editor').getEditedPostAttribute('acf');
```

The catch is that the fields are not registered, so they do not appear alongside the Post's other meta values. The solution is to register the fields' metadata names from PHP with [`register_meta`](https://developer.wordpress.org/reference/functions/register_meta/) when the Block or block plugin is initialized:

```php
// call from the init hook
$args = ['single' => true, 'show_in_rest' => true];
register_post_meta('page', 'acf_field_name', $args);
```

Once the fields are registered, they can be accessed like this:

```js
wp.data.select('core/editor').getEditedPostAttribute('meta');
```

> _Important : If meta values are not registered from PHP using [`register_post_meta`](https://developer.wordpress.org/reference/functions/register_post_meta/), JS will be unable to save them._

More on registering WordPress metadata here: https://make.wordpress.org/core/2018/07/27/registering-metadata-in-4-9-8

#### Migrating Field Data

I'm thinking about ways of migrating existing ACF field data into the Block Editor without additional plugins. The problem is that ACF doesn't seem to expose any of its configuration data to the API, so configuring field-data migrations can't be done automatically.

Another issue is that when editing posts, ACF input fields are saved after Block Editor metadata fields, so the ACF entries will overwrite the Block Editor entries, making it seem like the fields aren't saving.

## Changes from the default `@wordpress/create-block` scaffold

This project was initially scaffolded by running [`npx @wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/). To better fit our development practices, we added or modified the following:

### Additional Output Files

**@wordpress/scripts** `plugin-zip` [advanced configuration](https://github.com/WordPress/gutenberg/blob/65550e38a68befd30250a05a05d76a7d42ebfc22/packages/scripts/README.md#advanced-information-7) options references the **package.json** [`files` property](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#files) for specifying additional files to include in the distribution package.

> **TODO:** Possibly move PHP files into block.json.render to be automatically included. [Changelog](https://github.com/WordPress/gutenberg/blob/b40672c3e2f016c47d0e3be198eaf0b815cdbe7b/packages/scripts/CHANGELOG.md#new-features), [#43917](https://github.com/WordPress/gutenberg/pull/43917)

### Composer

The Composer application is called from Docker via a set of basic script commands added to **package.json** and a simple **docker-compose.yml** wrapper. The **vendor** directory lives at the top level of the plugin, parallel to **src**, **includes** and **node_modules**.

Composer's autoloader is called from the plugin's entry PHP file.

### Build tools

We add [version-everything](https://github.com/joemaller/version-everything), [auto-changelog](https://github.com/CookPete/auto-changelog) and Prettier's [PHP Plugin](https://github.com/prettier/plugin-php).

a `postbuild` script which is just an alias to the `plugin-zip` script. When would we ever build without outputting a bundle?

A custom version-everything config was added to package.json config to enable version updates in the `Stable tag:` field of the plugin's **readme.txt** metadata.

### Block.json file references

Any files references from **block.json** are relative to the output, not the source file. I hate this. The references are somehow also used for webpack entry-points, which means they are simultaneously being used to determine the _before_ while also knowing the _after_. It's really just madness.

### stuff in `src`

Any **block.json** files in **./src** will be scanned and used to generate entry-points for the plugin.

### `npm run build`

This will include any files referenced from all included **block.json** `editorScript` properties. File references are pre-compilation.

### Block.json styles

Sass and CSS files are are referenced using their post-compilation names. The source files should be imported into JS files so they can be handled by webpack. Output filenames are dependent upon where the source was imported.

## Other fixes

## Minimal `block.json` files

For the Meta Sidebar example, a bare bones **block.json** file is used to assign entrypoints for the wp-scripts webpack build. This also handles loading the scripts, but since they're is no actual block to show, we can leave out nearly everything else. All that's needed for WordPress to load the scripts is a `name`. With that `editorScript` and other assets will load automatically when the **block.json** file is registered.

Complete [block.json property reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#block-api)

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 2,
	"name": "ideasonpurpose/example-meta-sidebar",
	"title": "Example Meta Sidebar",
	"editorScript": "file:./index.js",
	"editorStyle": "file:./index.css"
}
```

### Properties

- [`$schema`](https://raw.githubusercontent.com/WordPress/gutenberg/trunk/schemas/json/block.json) - Helpful for development
- [`apiVersion`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#api-version) - Not required since there are no blocks to save, but it's probably a good idea to include for future compatibility.
- [`name`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#name) - The only truly required attribute, without this assets don't load.
- [`title`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#title) - While the Block appears to work fine without this, the schema lists it as required.
- [`editorScript`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#editor-script) - This script will be loaded by the Block Editor.
- [`editorStyle`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#editor-style) - Styles for the editor. Paths for this and the editorScript property are both relative to the _output_ which, as previously stated, is nuts.

### Additional block.json Properties

Other useful attributes:

- [`viewScript`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#editor-style) - Frontend-only javascript
- [`script`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#style) - A common script for _both_ the frontend and the block editor.
- [`style`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#style) - Styles for _both_ the frontend and the block editor.

---

## _Below here needs editing_

<blockquote>

## Using these Blocks directly in a Theme

These examples can be used in two forms. Each block can be individually added to a project, or the entire project can also be built and used as a plugin.

Each example includes two folders. One PascalCase containing PHP and the block.json file, and a kebab-case folder containing js and scss assets which need to be compiled.

To use the blocks individually, require the directory into your editor scripts, then require the view script into your front end scripts. The PHP class should be instantiated from **functions.php**.

```php
// functions.php
new Blocks\ExampleRichText\Block();
```

```js
// editor.js  (editor scripts source)
require('../blocks/example-rich-text');
```

```js
// main.js  (frontend scripts source)
require('../blocks/example-rich-text/view.js');
```

# Notes on building Blocks

A primary development goal is to easily migrate block code between themes and plugins. In most cases, blocks should exist as a plugin, so clients (and ourselves) are not stuck with a specific theme because content uses a block which only exists in there. Separation of concerns is important for longevity.

### Scripts

For now, all scripts should be added to `src/js/editor.js` and `src/js/main.js`. If the block becomes a plugin, then we can worry about separating individual scripts out for WordPress-optimized [block asset loading](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#assets).

</blockquote>

### How to handle Block.json in themes?

There's a reason for this. Registering a block happens from PHP and from JavaScript. The [`register_block_type`](https://developer.wordpress.org/reference/functions/register_block_type/) php function loads a JSON file which _might_ also be loaded from JavaScript. If we compiled the JSON with the rest of the JS build, PHP would have nothing to load, or we'd have to come up with some sort of convoluted, fragile arrangement for preserving or delivering the JSON to a known location.

Place `BlockName` into `<themename>/lib/` and `block-name` into `<themename>/src/blocks`

# Leftovers

**New Problem:** The editor loads a ridiculous amount of scripts. If all the dependencies for blocks are loaded in the front end, we're suddenly transferring nearly 5 MB of JS on each page load.

**Possible solution?** Block assets need to be divided up into frontend and backend. If the wp-blocks script ends up as a dependency, WordPress will load several dozen additional scripts. So instead of one entrypoint `index.js` script, we'll have three available assets to match block.json scripts:

- [`editorScript`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#editor-script) => `index.js` (editor/backend only)
- [`script`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#script) => `script.js` (for both front and back end)
- [`viewScript`](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script) => `view.js` (frontend only)

Those filenames are terrible, I might switch them to **editor**, **common** and **view**. Or **backend**, **common** and **frontend**?

_Huh, seems to actually be working!_

[@wordpress/scripts]: https://github.com/WordPress/gutenberg/blob/HEAD/packages/scripts/README.md
