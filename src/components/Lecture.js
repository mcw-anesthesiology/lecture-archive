/** @format */

import React, { useMemo } from 'react';
import { css } from '@emotion/core';
import { useQuery, gql } from '@apollo/client';
import Iframe from 'react-iframe';
import AspectRatio from 'react-aspect-ratio';
import { Player } from 'video-react';
import isUrl from 'is-url';

import { staffClient } from '../apollo-client.js';

import Loading from './Loading.js';
import AttachmentList from './AttachmentList.js';
import RichDate, { RichTime } from './RichDate.js';

import 'react-aspect-ratio/aspect-ratio.css';
import 'video-react/dist/video-react.css';

const lectureStyle = css`
	& .lecture-dates {
		display: block;

		& > span {
			display: inline-block;
			margin-left: 1em;
		}
	}
`;

const lecturePresentersStyle = css`
	margin: 0;
	padding: 0;
	display: flex;
	flex-wrap: wrap;

	& li {
		line-height: 1.2;
		list-style: none;
		margin: 0;
		margin-right: 0.5em;

		&::after {
			content: ',';
		}
	}

	& li:last-child::after {
		content: '';
		margin-right: 0;
	}
`;

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
		presenters {
			full_name
		}
		other_presenters
	}
`;

const PRESENTERS_QUERY = gql`
	query PresenterStaffQuery($emails: [String]) {
		staff(emails: $emails) {
			fullName
			email
			... on Faculty {
				fcdUrl
			}
		}
	}
`;

export function LecturePresenters({ lecture }) {
	const emails = lecture.presenters.map(p => p.user_email);
	const { data } = useQuery(PRESENTERS_QUERY, {
		variables: {
			emails
		},
		skip: emails.length === 0,
		client: staffClient
	});

	const presenters = useMemo(() => {
		return [
			...lecture.presenters.map(presenter =>
					<a href={`/presenter/${presenter.id}`} key={presenter.id}>
						{presenter.full_name}
					</a>
			),
			...lecture.other_presenters
		];
	}, [lecture, data]);

	if (!presenters.length) return null;

	return (
		<ul css={lecturePresentersStyle} className="lecture-presenters">
			{presenters.map((presenter, i) => (
				<li key={i}>{presenter}</li>
			))}
		</ul>
	);
}

export default function Lecture({ lecture }) {
	return (
		<div css={lectureStyle} className="lecture">
			<h1>{lecture.title}</h1>

			<LecturePresenters lecture={lecture} />

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

const lectureRecordingStyle = css`
	border: none;
`;

const RAW_VIDEO_RE = /\.(mp4)$/;

function isRawVideo(url) {
	return RAW_VIDEO_RE.test(url);
}

export function LectureRecording({ recording }) {
	if (!isUrl(recording)) return null;

	return (
		<AspectRatio ratio={1.5} style={{ maxWidth: '100%' }}>
			{isRawVideo(recording) ? (
				<Player src={recording} />
			) : (
				<Iframe src={recording} css={lectureRecordingStyle}>
					<a href={recording}>Recording link</a>
				</Iframe>
			)}
		</AspectRatio>
	);
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
