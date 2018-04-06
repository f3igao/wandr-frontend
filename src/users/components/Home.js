import React from 'react';
import withAuth from './withAuth';

const Home = props => (
	<div>
		<h1>Successful login</h1>
		<button onClick={() => props.logOut(props.history)}>Log Out</button>
	</div>
);

export default withAuth(Home);
