/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import Loading from '../components/Loading.js';
import { LectureGrid, LECTURE_LIST_FIELDS } from '../components/LectureList.js';
import {
	useSearchFormQueryParams,
	RecordingsOnlyInput,
	LimitInput
} from '../components/SearchForm.js';

import '../styles/index.css';

const LECTURES_QUERY = gql`
	query IndexPageLecturesQuery($limit: Int, $hasRecording: Boolean) {
		lectures(
			orderBy: [{ field: "lecture_date_start", order: DESC }]
			limit: $limit
			has_recording: $hasRecording
		) {
			...LectureListFields
		}
	}
	${LECTURE_LIST_FIELDS}
`;

export default function IndexPage({ location, navigate }) {
	const defaultLimit = 5;
	const { recordingsOnly, limit = defaultLimit } = useSearchFormQueryParams(
		location
	);
	const { data, loading } = useQuery(LECTURES_QUERY, {
		variables: {
			limit,
			hasRecording: recordingsOnly || undefined
		}
	});

	return (
		<Layout className="home">
			<SEO title="Home" />

			<p>Welcome! Use the search bar above to search for a lecture.</p>

			<p>
				Or, you can{' '}
				<Link to="/lecture-series">view by lecture series</Link>.
			</p>

			<section className="recent-lectures">
				<h2>Recent lectures</h2>

				{loading ? (
					<Loading />
				) : (
					data &&
					data.lectures && <LectureGrid lectures={data.lectures} />
				)}

				<form className="lecture-filter">
					<RecordingsOnlyInput {...{ location, navigate }} />
					<LimitInput {...{ location, navigate, defaultLimit }} />
				</form>
			</section>
		</Layout>
	);
}
