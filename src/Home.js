import React from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Button, Form, Input, Card, Placeholder } from "semantic-ui-react";
import Navbar from './components/Navbar';

import AnimeQuery from './components/AnimeQuery';


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            test: "first test",
            openSidebar: false,
            value: "",
        };
        this.changeProps = this.changeProps.bind(this);
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

    UNSAFE_componentWillMount() {
        // $('#root').append("<h1>Hello JQuery!</h1>");
        console.log("first Mount!");
        const fun = AnimeQuery.getAllMedia;
    }

    changeProps() {
        this.setState({
            test: this.state.value,
        });
    }

    onChangeValue = (event) => {
        this.setState({ value: event.target.value });
    };

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
                    <Button onClick={this.changeProps}>change props</Button>
                    <p>{this.state.value}</p>
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.onChangeValue}
                    />
                    <Link to="./anime" target="_self">
                        Go to Anime
                    </Link>
                    <br></br>
                    <Link to="./search" target="_self">
                        Go to Search
                    </Link>
                    <p>my test = {this.state.test}</p>

                    <Car />
                    <MyComponent qq={this.state.test} />

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
    constructor(props) {
        super(props);
        this.state = {
            array: [],
            value: "",
            test: props.qq
        };
        // this.addComponent = this.addComponent.bind(this);
    }

    UNSAFE_componentWillMount() {
        console.log("my component will mount");
        const myarray = [];
        myarray.push(<h6>my component</h6>);
        this.setState({
            array: myarray,
        });
    }

    componentWillReceiveProps() {
        console.log(this.props.qq);
        
    }

    UNSAFE_componentWillUpdate() {
        console.log("at component will update: " + this.props.qq);
    }

    componentDidMount() {
        console.log("at component did mount: " + this.props.qq);
    }

    componentDidUpdate() {
        console.log("at component did update: " + this.props.qq);
    }
    
    getSnapshotBeforeUpdate() {
        console.log("at snapshot before update: " + this.props.qq);
    }
    addComponent = () => {
        const myarray = [];
        myarray.push(<h6>{this.state.value}</h6>);
        this.setState({
            array: this.state.array.concat(myarray)
        });
    }

    onChangeValue = (event) => {
        this.setState({ value: event.target.value });
    };

    onClearArray = () => {
        this.setState({ array: [] });
    };

    onSubmit = (event) => {
        event.preventDefault();
        window.location.href = "/search/" + this.state.value + "/1/";
    }

    render() {
        return (
            <div>
                <p>{this.props.qq}</p>
                {this.state.array}
                <Button onClick={this.addComponent}>Add Component</Button>
                <Button onClick={this.onClearArray}>Clear Array</Button>
                <p>{this.state.value}</p>
                <form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.onChangeValue}
                    />
                </form>
            </div>
        );
    }
}

export default Home;
