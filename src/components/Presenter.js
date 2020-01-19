/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { useQuery } from '@apollo/client';

import gql from 'graphql-tag';

import Loading from './Loading.js';
import SEO from './Seo.js';
import LectureList, { LECTURE_LIST_FIELDS } from './LectureList.js';

const PRESENTER_FIELDS = gql`
	fragment PresenterFields on User {
		id
		full_name
		user_email

		lectures {
			...LectureListFields
		}
	}
	${LECTURE_LIST_FIELDS}
`;

const PRESENTER_QUERY = gql`
	query PresenterQuery($id: ID!) {
		user(id: $id) {
			...PresenterFields
		}
	}
	${PRESENTER_FIELDS}
`;

export function PresenterContainer({ id }) {
	const { data, loading } = useQuery(PRESENTER_QUERY, {
		variables: {
			id
		}
	});

	if (loading) return <Loading />;

	if (!data || !data.user) return <p>Sorry, no user found.</p>;

	return <Presenter user={data.user} />;
}

export default function Presenter({ user }) {
	return (
		<section>
			<SEO title={`${user.full_name} - Lectures`} />
			<h1>{user.full_name}</h1>

			<LectureList lectures={user.lectures} />
		</section>
	);
}
