/** @format */

import React from 'react';
import { css } from '@emotion/core';
import { useQuery, gql } from '@apollo/client';
import { Player } from 'video-react';

import Loading from './Loading.js';
import AttachmentList from './AttachmentList.js';
import RichDate, { RichTime } from './RichDate.js';

import 'video-react/dist/video-react.css';

export const LECTURE_FIELDS = gql`
	fragment LectureFields on Lecture {
		id
		title
		recording
		lecture_date_start
		lecture_date_end
		attachments {
			id
			name
			url
		}
	}
`;

const lectureStyle = css`
	& .lecture-dates {
		display: block;

		& > span {
			display: inline-block;
			margin-left: 1em;
		}
	}
`;

export default function Lecture({ lecture }) {
	return (
		<div css={lectureStyle} className="lecture">
			<h1>{lecture.title}</h1>

			<span className="lecture-dates">
				<RichDate date={lecture.lecture_date_start} />

				<span>
					<RichTime time={lecture.lecture_date_start} />
					–
					<RichTime time={lecture.lecture_date_end} />
				</span>
			</span>

			{lecture.recording && (
				<LectureRecording recording={lecture.recording} />
			)}

			{lecture.description && <p>{lecture.description}</p>}

			{lecture.attachments && (
				<AttachmentList attachments={lecture.attachments} />
			)}
		</div>
	);
}

export function LectureRecording({ recording }) {
	return <Player src={recording} />;
}

const LECTURE_QUERY = gql`
	query LectureQuery($id: ID!) {
		lecture(id: $id) {
			...LectureFields
		}
	}
	${LECTURE_FIELDS}
`;

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
