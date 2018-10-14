import React, { Component } from 'react';
import firebase from 'firebase';
import { logout } from './../helpers/auth'
import Calendar from '../components/Calendar'

class Home extends Component {
	
	render () {
		let user = firebase.auth().currentUser;
		return (
			<div>
				<h1>Welcome, {user.displayName}</h1>
				<Calendar />
				<button onClick={logout}>Logout</button>
			</div>
		);
	}
}

export default Home;