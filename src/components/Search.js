import React from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import Navbar from "./Navbar";
import MediaList from "./MediaList";

function Search(props) {
    let match = useRouteMatch();
    // console.log(props);
    return (
        <Switch>
            <Route path={`${match.path}/:id`} render={(props) => <SearchResultPage {...props} />} >
            </Route>
            <Route path={match.path} render={(props) => <SearchDefaultPage {...props} />}>
            </Route>
        </Switch>
    );
}

class SearchResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
        };
        this.DefaultConfig = {
            search: props.match.params.id,
            type: '',
            season: '',
            seasonYear: '',
            sort: '',
        };
    }

    shouldComponentUpdate(nextProps) {
        // do not re-render if same search key
        if (this.state.id === nextProps.match.params.id) {
            return false;
        }
        return true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.match.params.id,
        });
    }

    render() {
        return (
            <Navbar search={this.state.id} {...this.props}>
                <MediaList type="search" searchKey={this.state.id} config={this.DefaultConfig} />
            </Navbar>
        );
    }
}


class SearchDefaultPage extends React.Component {
    render() {
        return (
            <Navbar active='search' {...this.props}>
                <MediaList type="explore" />
            </Navbar>
        );
    }
}

export default Search;