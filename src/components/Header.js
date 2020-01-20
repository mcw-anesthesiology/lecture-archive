/** @format */

import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import '../styles/header.css';

export default function Header({ siteTitle = '' }) {
	return (
		<header>
			<h1>
				<Link to="/" aria-label="Go home">
					{siteTitle}
				</Link>
			</h1>
		</header>
	);
}

Header.propTypes = {
	siteTitle: PropTypes.string
};
