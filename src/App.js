import React from 'react';
import logo from './logo.svg';
// import './App.css';
import Anime from './Anime';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Button, Form, Input, Sidebar } from "semantic-ui-react";
import Navbar from './components/Navbar';

import AnimeQuery from './components/AnimeQuery';

// function as component
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            test: "first test",
            openSidebar: false,
        };
    }

    handleToggle = () => this.setState({ openSidebar: true });

    componentDidUpdate() {
        console.log("updated~~ componentDidUpdate, after updated");
    }

    componentDidMount() {
        console.log("Mount finished!");
        $(".App-header").append("<h1>Hello JQuery!</h1>");
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
            <Navbar active="home">
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
                    <Link to="./anime" target="_self">
                        Go to Anime
                    </Link>
                    <br></br>
                    <Link to="./search" target="_self">
                        Go to Search
                    </Link>
                    <p>my test = {this.state.test}</p>

                    <Car />
                    <MyComponent />
                    <Car3>
                        <Car />
                    </Car3>
                </header>
            </Navbar>
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

class Car3 extends React.Component {
  render() {
      return (
          <div>
              <h2>Hi, I am a Car33!</h2>
              {this.props.children}
          </div>
      );
  }
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
