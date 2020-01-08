/** @format */

import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'gatsby';
import { Router, Location } from '@reach/router';
import { useQuery, gql } from '@apollo/client';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import { LectureContainer } from '../components/Lecture.js';
import Loading from '../components/Loading.js';

export default function SearchPage({ location, navigate }) {
	let query = '',
		recordingsOnly,
		attachmentsOnly;
	if (location) {
		const params = new URLSearchParams(location.search);
		query = params.get('query') || '';
		if (params.has('recordingsOnly')) {
			recordingsOnly = Boolean(params.get('recordingsOnly'));
		}
		if (params.has('attachmentsOnly')) {
			attachmentsOnly = Boolean(params.get('attachmentsOnly'));
		}
	}
	const [enteredQuery, setEnteredQuery] = useState(query);
	const [hasRecording, setHasRecording] = useState(Boolean(recordingsOnly));
	const [hasAttachment, setHasAttachment] = useState(
		Boolean(attachmentsOnly)
	);

	useEffect(() => {
		setEnteredQuery(query);
	}, [query]);

	const handleSubmit = useCallback(event => {
		event.preventDefault();

		const params = new URLSearchParams();
		if (enteredQuery) {
			params.set('query', enteredQuery);
		}
		if (hasRecording) {
			params.set('recordingsOnly', true);
		}
		if (hasAttachment) {
			params.set('attachmentsOnly', true);
		}
		navigate(`?${params.toString()}`);
	});

	return (
		<Layout>
			<SEO title="Lecture" />
			<form onSubmit={handleSubmit}>
				<input
					type="search"
					name="query"
					value={enteredQuery}
					onChange={event => {
						setEnteredQuery(event.target.value);
					}}
				/>
				<button type="submit">Search</button>
				<fieldset>
					<legend>Only show lectures with:</legend>
					<label>
						<input
							type="checkbox"
							checked={hasRecording}
							onChange={event => {
								setHasRecording(event.target.checked);
							}}
						/>
						recordings
					</label>
					<label>
						<input
							type="checkbox"
							checked={hasAttachment}
							onChange={event => {
								setHasAttachment(event.target.checked);
							}}
						/>
						attachments
					</label>
				</fieldset>
			</form>

			{query && (
				<SearchResults
					{...{ query, recordingsOnly, attachmentsOnly }}
				/>
			)}
		</Layout>
	);
}

const LECTURE_SEARCH_QUERY = gql`
	query LectureSearchQuery($query: String, $has_recording: Boolean) {
		lectures(search: $query, has_recording: $has_recording) {
			id
			title
			recording
			attachments {
				id
				name
				url
			}
		}
	}
`;

export function SearchResults({ query, recordingsOnly, attachmentsOnly }) {
	const { data, loading } = useQuery(LECTURE_SEARCH_QUERY, {
		variables: {
			query,
			has_recording: recordingsOnly || undefined,
			has_attachment: attachmentsOnly || undefined
		},
		fetchPolicy: 'cache-and-network'
	});

	if (loading && !data) {
		return <Loading />;
	}

	if (data && data.lectures) {
		const { lectures } = data;
		return (
			<div>
				{lectures.length > 0 ? (
					<>
						<p>
							Results for <i>{query}</i>
						</p>
						<ol>
							{lectures.map(lecture => (
								<li key={lecture.id}>
									<SearchResultLecture lecture={lecture} />
								</li>
							))}
						</ol>
					</>
				) : (
					<p>
						No lectures found for <i>{query}</i>
					</p>
				)}
			</div>
		);
	}
}

export function SearchResultLecture({ lecture }) {
	return (
		<div>
			<Link to={`/lecture/${lecture.id}`}>{lecture.title}</Link>
			{lecture.attachments && (
				<div>
					<ul>
						{lecture.attachments.map(attachment => (
							<li key={attachment.id}>
								<a href={attachment.url}>{attachment.name}</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
