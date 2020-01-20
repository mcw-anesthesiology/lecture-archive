/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { navigate, Location } from '@reach/router';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Loading from './Loading.js';
import SEO from './Seo.js';
import { LectureGrid, LECTURE_LIST_FIELDS } from './LectureList.js';
import { RecordingsOnlyInput, useSearchFormQueryParams } from './SearchForm.js';

const PRESENTER_QUERY = gql`
	query PresenterQuery($id: ID!, $hasRecording: Boolean) {
		user(id: $id) {
			id
			full_name
			user_email

			lectures(has_recording: $hasRecording) {
				...LectureListFields
			}
		}
	}
	${LECTURE_LIST_FIELDS}
`;

export function PresenterContainer({ id, location }) {
	const { recordingsOnly } = useSearchFormQueryParams(location);
	const { data, loading } = useQuery(PRESENTER_QUERY, {
		variables: {
			id,
			hasRecording: recordingsOnly || undefined
		},
		fetchPolicy: 'cache-and-network'
	});

	if (loading && !data) return <Loading />;

	return (
		<div>
			{data && data.user ? (
				<Presenter user={data.user} loadingLectures={loading} />
			) : (
				<p>Sorry, no presenter found.</p>
			)}

			<form className="lecture-filter">
				<RecordingsOnlyInput {...{ location, navigate }} />
			</form>
		</div>
	);
}

export default function Presenter({ user, loadingLectures }) {
	return (
		<section>
			<SEO title={user.full_name} />
			<h1>{user.full_name}</h1>

			{loadingLectures ? (
				<Loading />
			) : (
				<LectureGrid lectures={user.lectures} />
			)}
		</section>
	);
}
