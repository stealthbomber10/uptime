import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Calendar from './Calendar';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import app from './firebase-config'

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';


class App extends Component {
  state = { loading: true, authenticated: false, user: null };

  componentWillMount() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }

  render() {
    const { authenticated, loading } = this.state;

    if (loading) return <p>Loading...</p>;

    return (
      <Router>
        <div>
          <PrivateRoute
            exact
            path="/"
            component={Home}
            authenticated={this.state.authenticated}/>
          <Route exact path="/" component={LogIn} />
          <Route exact path="/" component={SignUp} />
        </div>
      </Router>
      // {/* <div className="App">
      //   <header className="App-header">
      //    <h1>
      //      UpTime!
      //      </h1>
      //     <Calendar/>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //     </a>
      //   </header>
      // </div> */}
    );
  }
}

export default App;
