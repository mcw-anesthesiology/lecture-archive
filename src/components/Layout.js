/** @format */

/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { Location, navigate } from '@reach/router';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './Header.js';
import SearchForm from '../components/SearchForm.js';

import '../styles/globals.css';
import '../styles/layout.css';

export default function Layout({ children, className }) {
	const data = useStaticQuery(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`);

	return (
		<article className="layout">
			<Header siteTitle={data.site.siteMetadata.title} />
			<main className={className}>
				<Location>
					{({ location }) => (
						<SearchForm {...{ location, navigate }} />
					)}
				</Location>
				{children}
			</main>
		</article>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired
};
