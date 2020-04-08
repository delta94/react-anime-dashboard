import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Anime from './Anime';
import App from './App';
import Error from './Error';
import Search from './Search';

const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={App}></Route>
            <Route exact path='/anime' component={Anime}></Route>
            <Route path='/anime/search' component={Search}></Route>
            <Route component={Error}></Route>
        </Switch>
    );
}

export default Main;