/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import LectureList, { LECTURE_LIST_FIELDS } from '../components/LectureList.js';
import Loading from '../components/Loading.js';

const LECTURE_SERIES_LECTURE_LIMIT = 5;

const LECTURE_SERIES_QUERY = gql`
	query LectureSeriesQuery($limit: Int) {
		lecture_series(orderBy: [{ field: "name", order: ASC }]) {
			id
			name
			description
			lectures(
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
	const { data, loading } = useQuery(LECTURE_SERIES_QUERY, {
		variables: {
			limit: LECTURE_SERIES_LECTURE_LIMIT
		}
	});

	return (
		<Layout className="lecture-series">
			<SEO title="Home" />

			{loading ? (
				<Loading />
			) : (
				<div>
					{data.lecture_series
						.filter(ls => ls.lectures.length)
						.map(ls => (
							<div key={ls.id}>
								<h2>{ls.name}</h2>
								<p>{ls.description}</p>

								<LectureList lectures={ls.lectures} />
							</div>
						))}
				</div>
			)}
		</Layout>
	);
}
