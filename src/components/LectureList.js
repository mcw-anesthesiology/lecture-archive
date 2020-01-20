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
			id
			full_name
		}
		other_presenters
	}
`;

const LECTURE_LIST_ITEM_WIDTH = '300px';

const lectureListStyle = css`
	display: flex;
	max-width: 100%;
	overflow-x: auto;
	margin: 1em -0.5em;

	& > .lecture-list-item {
		margin: 0.5em;
	}
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

const lectureGridStyle = css`
	display: flex;
	flex-wrap: wrap;

	@supports (display: grid) {
		display: grid;
		grid-gap: 1em;
		grid-template-columns: repeat(auto-fit, ${LECTURE_LIST_ITEM_WIDTH});
	}
`;

export function LectureGrid({ lectures }) {
	return (
		<div css={lectureGridStyle}>
			{lectures.map(lecture => (
				<LectureListItem key={lecture.id} lecture={lecture} />
			))}
		</div>
	);
}

const lectureListItemStyle = css`
	flex-shrink: 0;
	width: ${LECTURE_LIST_ITEM_WIDTH};
	min-height: 150px;
	background: #eee;

	& > a {
		display: block;
		padding: 1em;
		width: 100%;
		height: 100%;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&,
		&:visited {
			color: unset;
		}

		& > * ~ * {
			margin-top: 0.25em;
		}
	}

	&:hover {
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.75);
	}

	& header {
		display: flex;
		justify-content: space-between;

		& h2 {
			font-size: 1.25em;
			margin-bottom: 0.5em;
		}
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

	return (
		<section css={lectureListItemStyle} className="lecture-list-item">
			<Link to={lectureUrl}>
				<header>
					<h2>{lecture.title}</h2>
					{icons.length > 0 && <aside>{icons}</aside>}
				</header>

				{lecture.notes && <p>{lecture.notes}</p>}

				<LecturePresenters lecture={lecture} showLinks={false} />

				<RichDate date={lecture.lecture_date_start} />
			</Link>
		</section>
	);
}
