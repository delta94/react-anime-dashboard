import React from 'react';
import logo from './logo.svg';
import './App.css';
import Anime from './Anime';
import Node from "./Node";
import {Link } from 'react-router-dom';

// function as component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiRes: "" };
  }

  callAPI() {

  }
  componentWillMount() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
          <br></br>
          <Link to="./anime" target="_self">Go to Anime</Link><br></br>
          <Link to="./anime/search" target="_self">Go to Search</Link>

          

          <Car />
          <Anime />
        </header>
      </div>
    );
  }
}

// class as component
class Car extends React.Component {
  render() {
    return <div><h2>Hi, I am a Car!</h2><Car2 /></div>;
  }
}

// function as component
function Car2() {
    return <h3>Hi, I am car22222!</h3>;
  
}

function test() {
  React.createElement('h1', {}, 'heading');
}

export default App;
