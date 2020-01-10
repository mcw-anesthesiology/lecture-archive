/** @format */

import React from 'react';
import { css } from '@emotion/core';

import FileIcon, { defaultStyles } from 'react-file-icon';
import { logError } from '../errors.js';

const attachmentList = css`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin: 1em;
`;

const attachmentListItem = css`
	border: 1px solid #ccc;
	margin: 1em;
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;

	& .icon-container {
		padding: 0.5em;
	}

	& svg {
		display: block;
		margin: 0 auto;
		width: 4em;
	}

	& span {
		display: block;
		padding: 0.5em;
		border-top: 1px solid #ccc;
		background: #fafafa;
		margin-top: 0.25em;
	}
`;

export default function AttachmentList({ attachments = [] }) {
	return (
		<div css={attachmentList}>
			{attachments.map(attachment => (
				<AttachmentListItem
					key={attachment.id}
					attachment={attachment}
				/>
			))}
		</div>
	);
}

function getFileType(extension) {
	if (extension) {
		const map = new Map([
			['image', /(jpg|png|jpeg)/i],
			['presentation', /ppt.?/i],
			['spreadsheeet', /xls.?/i]
		]);

		for (const [fileType, regex] of map.entries()) {
			if (extension.match(regex)) {
				return fileType;
			}
		}
	}

	return 'document';
}

function AttachmentListItem({ attachment }) {
	let extension;
	try {
		extension = attachment.url
			.substring(attachment.url.lastIndexOf('.') + 1)
			.toLowerCase();
	} catch (err) {
		logError(err);
	}

	const fileType = getFileType(extension);

	return (
		<a
			css={attachmentListItem}
			href={attachment.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			<div className="icon-container">
				<FileIcon
					extension={extension}
					type={fileType}
					{...(defaultStyles[extension] || {})}
				/>
			</div>
			<span>{attachment.name}</span>
		</a>
	);
}
