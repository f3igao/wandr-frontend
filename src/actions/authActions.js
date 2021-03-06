export const signUp = (
	{ firstname, lastname, hometown, dob, email, username, password },
	history
) => dispatch => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			user: { firstname, lastname, hometown, dob, email, username, password }
		})
	};
	fetch('https://wandr-backend.herokuapp.com/signup', options)
		.then(res => res.json())
		.then(json => {
			localStorage.setItem('jwt', json.jwt);
			dispatch({ type: 'FETCH_USER', payload: json.user });
		})
		.then(() => {
			history.push('/home');
		});
};

export const logIn = (username, password, history) => dispatch => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ user: { username, password } })
	};
	fetch('https://wandr-backend.herokuapp.com/login', options)
		.then(res => res.json())
		.then(json => {
			localStorage.setItem('jwt', json.jwt);
			dispatch({ type: 'FETCH_USER', user: json.user });
		})
		.then(() => {
			history.push('/home');
		});
};

export const fetchUser = (jwt, history) => dispatch => {
	const options = { headers: { Authorization: jwt } };
	fetch('https://wandr-backend.herokuapp.com/current_user', options)
		.then(res => res.json())
		.then(user => {
			dispatch({ type: 'FETCH_USER', user });
		});
};

export const logOut = history => dispatch => {
	localStorage.removeItem('jwt');
	dispatch({ type: 'LOG_OUT' });
	history.push('/');
};
