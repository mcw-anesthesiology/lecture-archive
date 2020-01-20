/** @format */

import React, { useState } from 'react';
import { css } from '@emotion/core';
import Iframe from 'react-iframe';
import AspectRatio from 'react-aspect-ratio';
import { Player } from 'video-react';
import isUrl from 'is-url';

import Loading from './Loading.js';

const lectureRecordingStyle = css`
	border: none;
`;

const RAW_VIDEO_RE = /\.(mp4)$/;

function isRawVideo(url) {
	return RAW_VIDEO_RE.test(url);
}

export default function LectureRecording({ recording }) {
	if (!isUrl(recording)) return null;

	return (
		<AspectRatio ratio={1.5} style={{ maxWidth: '100%' }}>
			{isRawVideo(recording) ? (
				<Player src={recording} />
			) : (
				<RecordingEmbed recording={recording} />
			)}
		</AspectRatio>
	);
}

export function RecordingEmbed({ recording }) {
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			{!loaded && <Loading />}
			<Iframe
				src={recording}
				css={lectureRecordingStyle}
				allowFullScreen
				onLoad={() => {
					setLoaded(true);
				}}
			>
				<a href={recording}>Recording link</a>
			</Iframe>
		</>
	);
}
