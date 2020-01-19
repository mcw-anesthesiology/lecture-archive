/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import {
	useBeforeAfterDateQueryParams,
	useSearchFormQueryParams
} from '../components/SearchForm.js';
import Loading from '../components/Loading.js';
import { LECTURE_LIST_FIELDS } from '../components/LectureList.js';

import '../styles/search.css';

export default function SearchPage({ location }) {
	return (
		<Layout>
			<SEO title="Lecture" />
			<SearchResults
				{...{
					location
				}}
			/>
		</Layout>
	);
}

export function SearchResults({ location }) {
	const { query, recordingsOnly, attachmentsOnly } = useSearchFormQueryParams(
		location
	);
	const { after, before } = useBeforeAfterDateQueryParams(location);

	const { data, loading } = useQuery(LECTURE_SEARCH_QUERY, {
		variables: {
			query,
			has_recording: recordingsOnly || undefined,
			has_attachment: attachmentsOnly || undefined,
			after,
			before
		},
		fetchPolicy: 'cache-and-network'
	});

	if (loading && !data) {
		return <Loading />;
	}

	if (data && data.lectures) {
		const { lectures } = data;
		return (
			<div>
				{lectures.length > 0 ? (
					<>
						<p>
							Results for <i>{query}</i>
						</p>
						<ol>
							{lectures.map(lecture => (
								<li key={lecture.id}>
									<SearchResultLecture lecture={lecture} />
								</li>
							))}
						</ol>
					</>
				) : (
					<p>
						No lectures found for <i>{query}</i>
					</p>
				)}
			</div>
		);
	}
}

export function SearchResultLecture({ lecture }) {
	return (
		<div>
			<Link to={`/lecture/${lecture.id}`}>{lecture.title}</Link>
		</div>
	);
}

const LECTURE_SEARCH_QUERY = gql`
	query LectureSearchQuery(
		$query: String
		$has_recording: Boolean
		$has_attachment: Boolean
		$after: Date
		$before: Date
	) {
		lectures(
			search: $query
			has_recording: $has_recording
			has_attachment: $has_attachment
			after: $after
			before: $before
		) {
			id
			...LectureListFields
		}
	}
	${LECTURE_LIST_FIELDS}
`;
