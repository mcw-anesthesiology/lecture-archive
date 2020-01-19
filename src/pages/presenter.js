/** @format */

import React from 'react';
import { Router } from '@reach/router';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import { PresenterContainer } from '../components/Presenter.js';

export default function PresenterPage() {
	return (
		<Layout className="presenter">
			<SEO title="Presenter" />
			<Router basepath="presenter">
				<PresenterContainer path=":id" />
			</Router>
		</Layout>
	);
}
