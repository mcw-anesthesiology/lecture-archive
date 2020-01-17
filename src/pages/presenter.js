/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { useQuery } from '@apollo/client';
import { Router } from '@reach/router';
import gql from 'graphql-tag';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';

import Loading from '../components/Loading.js';

export default function PresenterPage() {
	return (
		<Layout className="home">
			<SEO title="Presenter" />
			<Router basepath="presenter">
				<PresenterContainer path=":id" />
			</Router>
		</Layout>
	);
}

const PRESENTER_FIELDS = gql`
	fragment PresenterFields on User {
		id
		full_name
		user_email

		lectures {
			id
			title
			recording
		}
	}
`;

const PRESENTER_QUERY = gql`
	query PresenterQuery($id: ID!) {
		user(id: $id) {
			...PresenterFields
		}
	}
	${PRESENTER_FIELDS}
`;

function PresenterContainer({ id }) {
	const { data, loading } = useQuery(PRESENTER_QUERY, {
		variables: {
			id
		}
	});

	if (loading) return <Loading />;

	if (!data || !data.user) return <p>Sorry, no user found.</p>;

	return <PresenterProfile user={data.user} />;
}

function PresenterProfile({ user }) {
	return (
		<section>
			<h1>{user.full_name}</h1>
		</section>
	);
}
