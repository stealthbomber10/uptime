import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Calendar from './Calendar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
         <h1>
           UpTime!
           </h1>
          <Calendar/>
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
