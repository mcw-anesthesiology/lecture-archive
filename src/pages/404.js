/** @format */

import React from 'react';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';

const NotFoundPage = () => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>Page not found</h1>
		<p>Sorry, we couldn't find that page.</p>
	</Layout>
);

export default NotFoundPage;
