const postcssPresetEnv = require( 'postcss-preset-env' );
const packageConfig = require( '../helpers/package-config' );
const path = require( 'path' );
const fs = require( 'fs' );
const {getDefaultBrowsersList} = require( '../helpers/config' );

/**
 * Files containing CSS properties to be provided to `postcss-preset-env`.
 * Allows rendering the values in the finished CSS for IE11.
 *
 * If none of the CSS files exist, or properties are not provided in them,
 * the variable won't work in IE11.
 *
 * @link https://github.com/csstools/postcss-preset-env#importfrom
 */
const presetEnv = {
	importFrom: [
		path.resolve( packageConfig.workingDirectory, 'src/globals/pcss/variables.css' ),
		path.resolve( packageConfig.workingDirectory, '../pcss/globals/variables.css' ),
	].filter( filePath => fs.existsSync( filePath ) ),
};

/**
 * If browserslist is not specified, we fallback to WordPress defaults
 * except for IE11 which we don't support by default.
 *
 * @link https://github.com/csstools/postcss-preset-env#browsers
 */
if ( getDefaultBrowsersList() ) {
	presetEnv.browsers = getDefaultBrowsersList();
}


const config = {
	plugins: [
		require( 'postcss-import' ),
		require( 'postcss-custom-media' ),
		require( 'postcss-nested' ),
		postcssPresetEnv( presetEnv ),
		require( 'postcss-color-mod-function' ),
		require( '@lipemat/css-mqpacker' ),
	],
	parser: 'postcss-scss',
};

// For production we minify it.
if ( 'production' === process.env.NODE_ENV ) {
	config.plugins.push( require( 'postcss-clean' )( {
		level: 2,
	} ) );
} else {
	config.sourceMap = true;
}


module.exports = config;
