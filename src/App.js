import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
<<<<<<< HEAD
import Calendar from './components/Calendar'
=======
import Calendar from './Calendar';
>>>>>>> a94ccbdd34362539738a5ba0f861677d2a7eb266

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
<<<<<<< HEAD
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Calendar
          />
=======
         <h1>
           UpTime!
           </h1>
          <Calendar/>
>>>>>>> a94ccbdd34362539738a5ba0f861677d2a7eb266
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
        </header>
      </div>
    );
  }
}

export default App;
