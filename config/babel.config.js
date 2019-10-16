module.exports = {
	cacheDirectory: true,
	presets: [
		"@babel/preset-env",
		"@babel/preset-react",
		"@babel/preset-typescript"
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'react-hot-loader/babel'
	],
};

