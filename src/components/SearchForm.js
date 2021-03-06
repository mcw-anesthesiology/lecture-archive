/** @format */

import React, { useState, useCallback, useEffect } from 'react';
import { css } from '@emotion/core';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';

const flatpickrOptions = {
	dateFormat: 'M j, Y'
};

export function useBeforeAfterDateQueryParams(location) {
	const [state, setState] = useState({
		after: undefined,
		before: undefined
	});

	useEffect(() => {
		if (location) {
			let after, before;
			const params = new URLSearchParams(location.search);

			if (params.has('after')) {
				after = new Date(Number(params.get('after')));
			}
			if (params.has('before')) {
				before = new Date(Number(params.get('before')));
			}

			setState({
				after,
				before
			});
		}
	}, [location]);

	return state;
}

export function useSearchFormQueryParams(location) {
	const [state, setState] = useState({
		query: '',
		recordingsOnly: true,
		attachmentsOnly: false,
		limit: undefined
	});

	useEffect(() => {
		if (location) {
			let query = '',
				recordingsOnly = true,
				attachmentsOnly,
				limit;
			const params = new URLSearchParams(location.search);

			if (params.has('query')) {
				query = params.get('query');
			}

			if (params.has('limit')) {
				const n = Number(params.get('limit'));
				if (!Number.isNaN(n)) {
					limit = n;
				}
			}

			if (params.has('recordingsOnly')) {
				const v = params.get('recordingsOnly');
				if (v === 'false' || v === '0' || !Boolean(v)) {
					recordingsOnly = false;
				}
			}

			attachmentsOnly = Boolean(params.get('attachmentsOnly'));

			setState({
				query,
				recordingsOnly,
				attachmentsOnly,
				limit
			});
		}
	}, [location]);

	return state;
}

const searchFormStyle = css`
	& .search-input {
		display: flex;
		font-size: 1.125em;
		margin: 0 -0.25em;
	}

	& details summary {
		text-align: right;
		pointer-events: none;
	}

	& details summary > *,
	& details summary ::marker {
		pointer-events: auto;
		cursor: pointer;
	}

	& details summary:focus {
		outline: none;
	}

	& details summary:focus span {
		outline: 1px dotted;
		text-decoration: underline;
	}

	& .search-input > * {
		margin: 0.25em;
	}

	& .search-input input {
		flex-grow: 1;
	}

	& fieldset {
		padding: 1em;
	}

	& fieldset div {
		display: flex;
		flex-wrap: wrap;
	}

	& fieldset > div {
		align-items: flex-end;
	}

	& fieldset label {
		margin: 0.25em 0.5em;
	}

	& label input[type='text'],
	& label input[type='search'],
	& label input[type='number'],
	& label textarea {
		display: block;
	}

	& label input[type='checkbox']:first-child,
	& label input[type='radio']:first-child {
		display: inline-block;
		margin-right: 0.25em;
	}
`;

export default function SearchForm({ location, navigate }) {
	const {
		query = '',
		recordingsOnly,
		attachmentsOnly
	} = useSearchFormQueryParams(location);
	const { after, before } = useBeforeAfterDateQueryParams(location);

	const [enteredQuery, setEnteredQuery] = useState(query);
	const [hasRecording, setHasRecording] = useState(Boolean(recordingsOnly));
	const [hasAttachment, setHasAttachment] = useState(
		Boolean(attachmentsOnly)
	);
	const [selectedAfter, setSelectedAfter] = useState(after);
	const [selectedBefore, setSelectedBefore] = useState(before);

	useEffect(() => {
		setEnteredQuery(query);
	}, [query]);
	useEffect(() => {
		setHasRecording(recordingsOnly);
	}, [recordingsOnly]);
	useEffect(() => {
		setHasAttachment(attachmentsOnly);
	}, [attachmentsOnly]);
	useEffect(() => {
		setSelectedAfter(after);
	}, [after]);
	useEffect(() => {
		setSelectedBefore(before);
	}, [before]);

	const handleSubmit = useCallback(event => {
		event.preventDefault();

		const params = new URLSearchParams();
		if (enteredQuery) {
			params.set('query', enteredQuery);
		}
		if (!hasRecording) {
			params.set('recordingsOnly', false);
		}
		if (hasAttachment) {
			params.set('attachmentsOnly', true);
		}
		if (selectedAfter) {
			params.set('after', selectedAfter.valueOf());
		}
		if (selectedBefore) {
			params.set('before', selectedBefore.valueOf());
		}
		navigate(`/search?${params.toString()}`);
	});

	return (
		<form css={searchFormStyle} onSubmit={handleSubmit}>
			<div className="search-input">
				<input
					type="search"
					name="query"
					value={enteredQuery}
					onChange={event => {
						setEnteredQuery(event.target.value);
					}}
				/>
				<button type="submit">Search</button>
			</div>
			<details>
				<summary>
					<span>Advanced</span>
				</summary>
				<fieldset>
					<legend>Only show lectures</legend>
					<div>
						<div>
							<label>
								<input
									type="checkbox"
									checked={hasRecording}
									onChange={event => {
										setHasRecording(event.target.checked);
									}}
								/>
								With recordings
							</label>
							<label>
								<input
									type="checkbox"
									checked={hasAttachment}
									onChange={event => {
										setHasAttachment(event.target.checked);
									}}
								/>
								With attachments
							</label>
						</div>
					</div>
					<DateRangeSelector
						after={selectedAfter}
						before={selectedBefore}
						setAfter={setSelectedAfter}
						setBefore={setSelectedBefore}
					/>
				</fieldset>
			</details>
		</form>
	);
}

const dateRangeContainerStyle = css`
	flex-grow: 1;

	& > label {
		width: 8em;
		margin: 0.25em 0.5em;
		flex-grow: 1;
	}

	& input {
		display: block;
		width: 100%;
	}
`;

export function DateRangeSelector({ before, after, setBefore, setAfter }) {
	return (
		<div css={dateRangeContainerStyle}>
			<label>
				After
				<Flatpickr
					value={after}
					onChange={([d]) => {
						setAfter(d);
					}}
					options={flatpickrOptions}
				/>
			</label>
			<label>
				Before
				<Flatpickr
					value={before}
					onChange={([d]) => {
						setBefore(d);
					}}
					options={flatpickrOptions}
				/>
			</label>
		</div>
	);
}

const checkboxInputStyle = css`
	& input[type='checkbox'] {
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.25em;
	}
`;

export function RecordingsOnlyInput({ location, navigate }) {
	const { recordingsOnly } = useSearchFormQueryParams(location);

	const handleRecordingsOnlyChange = useCallback(
		event => {
			const { pathname, search } = location;

			const params = new URLSearchParams(search);
			if (!event.target.checked) {
				params.set('recordingsOnly', false);
			} else {
				params.delete('recordingsOnly');
			}

			navigate(`${pathname}?${params.toString()}`, { replace: true });
		},
		[location, navigate]
	);

	return (
		<label css={checkboxInputStyle}>
			<input
				type="checkbox"
				checked={recordingsOnly}
				onChange={handleRecordingsOnlyChange}
			/>
			Only show lectures with recordings
		</label>
	);
}

const limitInputStyle = css`
	& input {
		width: 9em;
	}
`;

export function LimitInput({ location, navigate, defaultLimit = '' }) {
	const { limit = defaultLimit } = useSearchFormQueryParams(location);

	const handleLimitChange = useCallback(
		event => {
			const { pathname, search } = location;

			const params = new URLSearchParams(search);
			params.set('limit', event.target.value);

			navigate(`${pathname}?${params.toString()}`, { replace: true });
		},
		[location, navigate]
	);

	return (
		<label css={limitInputStyle}>
			Lectures per series
			<input type="number" value={limit} onChange={handleLimitChange} />
		</label>
	);
}
