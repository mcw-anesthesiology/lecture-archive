/** @format */
/* global process */

import React from 'react';
import {
	ApolloClient,
	ApolloProvider,
	HttpLink,
	InMemoryCache
} from '@apollo/client';
import fetch from 'isomorphic-fetch';

export const lecturesClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri:
			process.env.GATSBY_LECTURES_ENDPOINT ||
			process.env.LECTURES_ENDPOINT
	}),
	fetch,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network'
		},
		query: {
			fetchPolicy: 'cache-and-network'
		}
	}
});

export default lecturesClient;

export const wrapRootElement = ({ element }) => (
	<ApolloProvider client={lecturesClient}>{element}</ApolloProvider>
);

export const staffClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: process.env.GATSBY_STAFF_ENDPOINT || process.env.STAFF_ENDPOINT
	}),
	fetch
});
