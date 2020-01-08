/** @format */

import React from 'react';
import { Link } from 'gatsby';
import { Router } from '@reach/router';

import Layout from '../components/Layout.js';
import SEO from '../components/Seo.js';
import { LectureContainer } from '../components/Lecture.js';

export default function LecturePage() {
	return (
		<Layout>
			<SEO title="Lecture" />
			<Router basepath="lecture">
				<LectureContainer path=":id" />
			</Router>
		</Layout>
	);
}
