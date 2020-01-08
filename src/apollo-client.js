/** @format */
/* global process */

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const { LECTURES_ENDPOINT } = process.env;

export const lecturesClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: LECTURES_ENDPOINT
	})
});

export default lecturesClient;
