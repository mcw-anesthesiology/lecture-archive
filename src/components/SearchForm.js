import React, { useState, useCallback, useEffect } from 'react';
import { css } from '@emotion/core';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/light.css';

const flatpickrOptions = {
	dateFormat: 'M j, Y'
};


export function useSearchFormQueryParams({ location }) {
	const [state, setState] = useState({
		query: '',
		recordingsOnly: false,
		attachmentsOnly: false,
		after: undefined,
		before: undefined
	});

	useEffect(() => {
		if (location) {
			let query = '', recordingsOnly, attachmentsOnly, after, before;
			const params = new URLSearchParams(location.search);

			if (params.has('query')) {
				query = params.get('query');
			}

			recordingsOnly = Boolean(params.get('recordingsOnly'));
			attachmentsOnly = Boolean(params.get('attachmentsOnly'));

			if (params.has('after')) {
				after = new Date(Number(params.get('after')));
			}
			if (params.has('before')) {
				before = new Date(Number(params.get('before')));
			}

			setState({
				query,
				recordingsOnly,
				attachmentsOnly,
				after,
				before
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

	& .dates-container {
		flex-grow: 1;
	}

	& .dates-container > label {
		width: 8em;
		flex-grow: 1;
	}

	& .dates-container input {
		width: 100%;
	}
`;

export default function SearchForm({ location, navigate }) {
	const {
		query = '',
		recordingsOnly,
		attachmentsOnly,
		after,
		before
	} = useSearchFormQueryParams({ location });

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
		if (hasRecording) {
			params.set('recordingsOnly', true);
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
					<span>
						Advanced
					</span>
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
						<div className="dates-container">
							<label>
								After
								<Flatpickr
									value={selectedAfter}
									onChange={([d]) => {
										setSelectedAfter(d);
									}}
									options={flatpickrOptions}
								/>
							</label>
							<label>
								Before
								<Flatpickr
									value={selectedBefore}
									onChange={([d]) => {
										setSelectedBefore(d);
									}}
									options={flatpickrOptions}
								/>
							</label>
						</div>
					</div>
				</fieldset>
			</details>
		</form>
	);
}
