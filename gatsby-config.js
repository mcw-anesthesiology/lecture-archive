/** @format */
/* eslint-env node */

const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	siteMetadata: {
		title: 'MCW Anesthesiology Lecture Archive',
		description: 'Lecture archive for MCW Anesthesiology department',
		author: 'Jacob Mischka <jmischka@mcw.edu>'
	},
	plugins: [
		'gatsby-plugin-emotion',
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: `${__dirname}/src/images`
			}
		},
		'gatsby-transformer-sharp',
		'gatsby-plugin-sharp',
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: 'gatsby-starter-default',
				short_name: 'MCW Lectures',
				start_url: '/',
				background_color: '#006f66',
				theme_color: '#006f66',
				display: 'minimal-ui',
				icon: 'src/images/icon.svg' // This path is relative to the root of the site.
			}
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// 'gatsby-plugin-offline',
		{
			resolve: 'gatsby-plugin-postcss',
			options: {
				postCssPlugins: [
					postcssPresetEnv({
						stage: 2,
						features: {
							'nesting-rules': true
						}
					})
				]
			}
		},
		{
			resolve: 'gatsby-plugin-google-analytics',
			options: {
				trackingId: 'UA-70580800-6'
			}
		}
	]
};
