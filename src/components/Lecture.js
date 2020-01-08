import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Loading from '../components/Loading.js';

const LECTURE_QUERY = gql`
	query LectureQuery($id: ID!) {
		lecture(id: $id) {
			id
			title
		}
	}
`;

export default function Lecture({ lecture: { title } }) {
	return (
		<div className="lecture">
			<h1>{title}</h1>
		</div>
	);
}

export function LectureContainer({ id }) {
	const { data, loading } = useQuery(LECTURE_QUERY, {
		variables: {
			id
		}
	});

	if (loading) {
		return <Loading />;
	}

	if (data && data.lecture) {
		return <Lecture lecture={data.lecture} />;
	} else {
		return <p>Sorry no lecture found.</p>;
	}
}
