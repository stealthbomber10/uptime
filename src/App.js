import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import app from './base'
import firebase from 'firebase';

// Views
import Login from './views/Login';
import Home from './views/Home';
import Base from './views/Base';
import NotFound from './views/NotFound';

// Styles
import './styles/main.css'
import { MuiThemeProvider } from 'material-ui/styles';
import mainTheme from './themes/mainTheme';
import 'typeface-roboto';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/home' />}
    />
  )
}

class App extends Component {
  state = { loading: true, authenticated: false };

  componentDidMount () {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <MuiThemeProvider theme={mainTheme}>
          <Switch>
            <PrivateRoute authed={this.state.authed} path="/home" component={Home} />
            <PublicRoute authed={this.state.authed} path='/login' component={Login} />
            <Route exact path="/" component={Base} />
            <Route component={NotFound} />
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }

  // render() {
  //   const { authenticated, loading } = this.state;

  //   if (loading) return <p>Loading...</p>;

  //   return (
  //     <Router>
  //       <div>
  //         <PrivateRoute
  //           exact
  //           path="/"
  //           component={Home}
  //           authenticated={this.state.authenticated}/>
  //         <Route exact path="/" component={LogIn} />
  //         <Route exact path="/" component={SignUp} />
  //       </div>
  //     </Router>
  //     // {/* <div className="App">
  //     //   <header className="App-header">
  //     //    <h1>
  //     //      UpTime!
  //     //      </h1>
  //     //     <Calendar/>
  //     //     <a
  //     //       className="App-link"
  //     //       href="https://reactjs.org"
  //     //       target="_blank"
  //     //       rel="noopener noreferrer"
  //     //     >
  //     //     </a>
  //     //   </header>
  //     // </div> */}
  //   );
  // }
}

export default App;
