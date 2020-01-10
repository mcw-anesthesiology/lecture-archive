/** @format */

import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/Layout.js';
import Image from '../components/Image.js';
import SEO from '../components/Seo.js';
import SearchForm from '../components/SearchForm.js';

export default function IndexPage({ location, navigate }) {
	return (
		<Layout className="home">
			<SEO title="Home" />

			<Link to="/lecture-series">Lecture series</Link>
		</Layout>
	);
}
