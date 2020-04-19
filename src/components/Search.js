import React from 'react';
import { useParams, useRouteMatch, Switch, Route } from 'react-router-dom';
import Navbar from "./Navbar";
import MediaList from "./MediaList";
import { Container } from "semantic-ui-react";


function Search() {
    let match = useRouteMatch();
    console.log(match);

    return (
        <Switch>
            <Route path={`${match.path}/:id/`}>
                <Result />
            </Route>
            <Route path={match.path}>
            </Route>
        </Switch>
    );
}

function Result() {
    let { id } = useParams();
    let match = useRouteMatch();
    console.log(id);
    return (
        <div>
            {/* <h3>Requested search ID: {id}</h3>
            <h3>Requested url: {match.url}</h3>
            <h3>Requested path: {match.path}</h3> */}
            <DisplayResult id={id}/>
        </div>
    );
}

class DisplayResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
        };
    }

    render() {
        return (
            <Navbar search={this.state.id}>
                <Container>
                    <MediaList type="search" searchKey={this.state.id} />
                </Container>
            </Navbar>
        );
    }
}

export default Search;