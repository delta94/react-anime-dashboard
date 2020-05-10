import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css"; // semantic-ui
import "./index.css";  // custom global css

// import main components
import Anime from './components/Anime';
import Manga from './components/Manga';
import Home from './Home';
import Error from './components/Error';
import Search from './components/Search';

import * as serviceWorker from './serviceWorker';

const basename = '/my-react-app/build';

// Main app component, set different main components for different routing paths.
const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/anime' component={Anime}></Route>
            <Route exact path='/manga' component={Manga}></Route>
            <Route path='/search' component={Search}></Route>
            <Route component={Error}></Route>
        </Switch>
    );
}

// <BrowserRouter basename={basename}>  for deployment
ReactDOM.render(<BrowserRouter ><Main /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
