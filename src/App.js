import React from 'react';
import logo from './logo.svg';
// import './App.css';
import Anime from './Anime';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Button, Form, Input } from "semantic-ui-react";

// function as component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiRes: "", test: "first test" };
  }

  componentDidUpdate() {
    console.log("updated~~ componentDidUpdate, after updated");
  }


  componentDidMount() {
    console.log("Mount finished!")
    $('.App-header').append("<h1>Hello JQuery!</h1>");
    this.setState({ test: "second test" });
  }

  componentWillUpdate() {
    console.log("state updated before render: componentWillUpdate ");
  }

  

  componentWillMount() {
    // $('#root').append("<h1>Hello JQuery!</h1>");
    console.log("first Mount!");
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
          <Link to="./search" target="_self">Go to Search</Link>
          <p>my test = {this.state.test}</p>
          

          <Car />
          <Anime />
          <MyComponent />
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

class MyComponent extends React.Component {
  render() {
    return (
      <Form>
        <Form.Field>
          <label htmlFor="name">Name</label>
          <Input name="name" />
        </Form.Field>
        <Form.Field>
          <label htmlFor="email">Email</label>
          <Input name="email" />
        </Form.Field>
        <Button primary>Submit</Button>
      </Form>
    );
  }
}

export default App;
