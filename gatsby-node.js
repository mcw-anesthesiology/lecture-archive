/** @format */
/* eslint-env node */

exports.onCreatePage = ({ page, actions }) => {
	const { createPage } = actions;
	// Make the front page match everything client side.
	// Normally your paths should be a bit more judicious.

	if (page.path.match(/^\/lecture($|\/)/)) {
		page.matchPath = `/lecture/*`;
		createPage(page);
	}
	if (page.path.match(/^\/lecture-series($|\/)/)) {
		page.matchPath = `/lecture-series/*`;
		createPage(page);
	}
	if (page.path.match(/^\/presenter($|\/)/)) {
		page.matchPath = `/presenter/*`;
		createPage(page);
	}
};
