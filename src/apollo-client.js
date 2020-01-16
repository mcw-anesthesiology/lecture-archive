/** @format */
/* global process */

import React from 'react';
import {
	ApolloClient,
	ApolloProvider,
	HttpLink,
	InMemoryCache
} from '@apollo/client';

export const lecturesClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: process.env.LECTURES_ENDPOINT
	})
});

export default lecturesClient;

export const wrapRootElement = ({ element }) => (
	<ApolloProvider client={lecturesClient}>{element}</ApolloProvider>
);

export const staffClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: process.env.STAFF_ENDPOINT
	})
});
