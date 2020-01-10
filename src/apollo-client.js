/** @format */
/* global process */

import React from 'react';
import {
	ApolloClient,
	ApolloProvider,
	HttpLink,
	InMemoryCache
} from '@apollo/client';

const { LECTURES_ENDPOINT } = process.env;

export const lecturesClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: LECTURES_ENDPOINT
	})
});

export default lecturesClient;

export const wrapRootElement = ({ element }) => (
	<ApolloProvider client={lecturesClient}>{element}</ApolloProvider>
);
