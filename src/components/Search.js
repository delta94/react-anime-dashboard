import React from 'react';
import { useParams, useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import AnimeQuery from './AnimeQuery';
import Navbar from "./Navbar";
import MediaList from "./MediaList";
import { Container } from "semantic-ui-react";


function Search() {
    let match = useRouteMatch();
    console.log(match);

    return (
        <Navbar>
            <div>
                <h1>My Router Test...</h1>
                <h4>match.url = {match.url}</h4>
                <h4>match.path = {match.path}</h4>
                {/* <h4>match.params = {match.params}</h4> */}
                <h4>match.isExact = {match.isExact}</h4>
                <hr></hr>
                <Switch>
                    <Route path={`${match.path}/:id/`}>
                        <Result />
                    </Route>
                    <Route path={match.path}>
                    </Route>
                </Switch>
            </div>
        </Navbar>
    );
}

function Result() {
    let { id } = useParams();
    let match = useRouteMatch();
    console.log(id);
    return (
        <div>
            <h3>Requested search ID: {id}</h3>
            <h3>Requested url: {match.url}</h3>
            <h3>Requested path: {match.path}</h3>
            <DisplayResult id={id}/>
        </div>
    );
}

class DisplayResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            result: null
        };
    }

    componentWillMount() {
        
    }

    render() {
        return (
            <MediaList type="search" searchKey={this.state.id} />
        );
    }
}

export default Search;