import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css"; // semantic-ui
import './App.css';

// import main components
import Anime from './Anime';
import App from './App';
import Error from './Error';
import Search from './Search';
import Latest from './components/Latest';
import Popular from './components/Popular';

import * as serviceWorker from './serviceWorker';
// import $ from 'jquery';


// Main app component, set different main components for different routing paths.
const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={App}></Route>
            <Route exact path='/anime' component={Anime}></Route>
            <Route exact path='/anime/latest' component={Latest}></Route>
            <Route exact path='/anime/popular' component={Popular}></Route>
            <Route exact path='/manga' component={Anime}></Route>
            <Route path='/search' component={Search}></Route>
            <Route component={Error}></Route>
        </Switch>
    );
}

ReactDOM.render(<BrowserRouter basename="/my-react-app/build"><Main /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
