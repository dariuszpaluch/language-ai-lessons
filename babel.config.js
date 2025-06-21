// This file is required for Jest to transpile our ES Modules code
// when running tests.
export default {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
	],
};
