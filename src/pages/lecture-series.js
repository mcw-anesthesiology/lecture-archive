/** @format */

import React, { useState, useCallback } from 'react';
import { Router } from '@reach/router';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import LectureList, { LECTURE_LIST_FIELDS } from '../components/LectureList.js';
import { LectureSeriesContainer } from '../components/LectureSeries.js';
import Loading from '../components/Loading.js';
import {
	useSearchFormQueryParams,
	LimitInput,
	RecordingsOnlyInput
} from '../components/SearchForm.js';

import '../styles/lecture-series.css';

const LECTURE_SERIES_QUERY = gql`
	query LectureSeriesQuery($limit: Int, $hasRecording: Boolean) {
		lecture_series(orderBy: [{ field: "name", order: ASC }]) {
			id
			name
			description
			lectures(
				has_recording: $hasRecording
				limit: $limit
				orderBy: [{ field: "lecture_date_start", order: DESC }]
			) {
				...LectureListFields
				lecture_date_start
			}
		}
	}
	${LECTURE_LIST_FIELDS}
`;

export default function LectureSeriesPage() {
	return (
		<Layout className="lecture-series">
			<SEO title="Lecture series" />

			<Router basepath="lecture-series">
				<LectureSeriesHome default />
				<LectureSeriesContainer path=":id" />
			</Router>
		</Layout>
	);
}

export function LectureSeriesHome({ location, navigate }) {
	const defaultLimit = 5;
	const { recordingsOnly, limit = defaultLimit } = useSearchFormQueryParams(
		location
	);

	const { data, loading } = useQuery(LECTURE_SERIES_QUERY, {
		variables: {
			limit,
			hasRecording: recordingsOnly || undefined
		}
	});

	return (
		<div>
			<form className="lecture-filter">
				<RecordingsOnlyInput {...{ location, navigate }} />
				<LimitInput {...{ location, navigate, defaultLimit }} />
			</form>

			{loading ? (
				<Loading />
			) : (
				<div>
					{data.lecture_series
						.filter(ls => ls.lectures.length)
						.map(ls => (
							<div
								key={ls.id}
								className="lecture-series-list-item"
							>
								<h2>
									<Link to={`/lecture-series/${ls.id}`}>
										{ls.name}
										<small>See all</small>
									</Link>
								</h2>

								{ls.description && <p>{ls.description}</p>}

								<LectureList lectures={ls.lectures} />
							</div>
						))}
				</div>
			)}
		</div>
	);
}
