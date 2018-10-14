import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Base extends Component {
	
	render () {
		return (
			<Redirect to="/home"/>
		);
	}
}

export default Base;