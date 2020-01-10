/** @format */

import React from 'react';
import { css } from '@emotion/core';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';

import RichDate from './RichDate.js';

export const LECTURE_LIST_FIELDS = gql`
	fragment LectureListFields on Lecture {
		id
		title
		recording
		lecture_date_start
		lecture_date_end
		presenters {
			full_name
		}
		other_presenters
	}
`;

const lectureListStyle = css`
	display: flex;
	flex-wrap: wrap;
	margin: -0.5em;
`;

export default function LectureList({ lectures }) {
	return (
		<div css={lectureListStyle}>
			{lectures.map(lecture => (
				<LectureListItem key={lecture.id} lecture={lecture} />
			))}
		</div>
	);
}

const lectureListItemStyle = css`
	width: 250px;
	height: 100px;
	margin: 0.5em;

	& ul {
		margin: 0;
		padding: 0;

		& li {
			display: inline-block;
		}

		& li ~ li::before {
			content: ', ';
		}
	}
`;

export function LectureListItem({ lecture }) {
	const presenterNames = lecture.presenters
		.map(p => p.full_name)
		.concat(lecture.other_presenters);

	return (
		<div css={lectureListItemStyle}>
			<Link to={`/lecture/${lecture.id}`}>{lecture.title}</Link>

			{lecture.description && <p>{lecture.description}</p>}

			<div>
				<RichDate date={lecture.lecture_date_start} />
			</div>

			<ul>
				{presenterNames.map(name => (
					<li key={name}>{name}</li>
				))}
			</ul>
		</div>
	);
}
