/** @format */

import React, { useCallback } from 'react';
import { navigate } from '@reach/router';
import { css } from '@emotion/core';
import { Link } from 'gatsby';
import { useQuery, gql } from '@apollo/client';
import { Film, Paperclip } from 'react-feather';

import RichDate from './RichDate.js';
import { LecturePresenters } from './Lecture.js';

export const LECTURE_LIST_FIELDS = gql`
	fragment LectureListFields on Lecture {
		id
		title
		recording
		lecture_date_start
		lecture_date_end
		presenters {
			full_name
			email
		}
		other_presenters
	}
`;

const lectureListStyle = css`
	display: flex;
	max-width: 100%;
	overflow-x: auto;
	margin: 2em 0;
	padding: 0.5em;
	background: #888;
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
	flex-shrink: 0;
	width: 250px;
	min-height: 150px;
	margin: 0.5em;
	padding: 1em;
	background: #eee;

	& > a {
		text-decoration: none;

		&,
		&:visited {
			color: unset;
		}
	}

	&:hover {
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);
	}

	& header {
		display: flex;
		justify-content: space-between;
	}

	& aside {
		display: flex;
	}

	& .lecture-presenters {
		font-size: 0.8em;
	}
`;

const ICON_SIZE = 18;

export function LectureListItem({ lecture }) {
	const icons = [];

	if (lecture.recording) {
		icons.push(<Film size={ICON_SIZE} />);
	}

	if (lecture.attachments && lecture.attachments.length > 0) {
		icons.push(<Paperclip size={ICON_SIZE} />);
	}

	const lectureUrl = `/lecture/${lecture.id}`;

	const navigateToLecture = useCallback(event => {
		if (event.defaultPrevented) return;

		navigate(lectureUrl);
	}, [lectureUrl]);

	return (
			<section css={lectureListItemStyle}>
				<Link to={lectureUrl}>
				<header>
					<h2>
						{lecture.title}
					</h2>
					{icons.length > 0 && <aside>{icons}</aside>}
				</header>

				{lecture.description && <p>{lecture.description}</p>}

				<div>
					<RichDate date={lecture.lecture_date_start} />
				</div>

				<LecturePresenters lecture={lecture} />
				</Link>
			</section>
	);
}
