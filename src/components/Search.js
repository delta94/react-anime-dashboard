import React from 'react';
import { useParams, useRouteMatch, Switch, Route, Link } from 'react-router-dom';
import AnimeQuery from './AnimeQuery';


function Search() {
    let match = useRouteMatch();
    console.log(match);

    function click() {
        var key = document.getElementById('search').value;
        window.location.href = match.url + "/" + key;
        
    }

    return (
    <div>
        <h1>My Router Test...</h1>
        <h4>match.url = {match.url}</h4>
        <h4>match.path = {match.path}</h4>
        {/* <h4>match.params = {match.params}</h4> */}
        <h4>match.isExact = {match.isExact}</h4>
            <ul>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/na`}>na</Link>
                </li>
                <li>
                    <Link to={`${match.url}/shana`}>shana</Link>
                </li>
            </ul>
            <hr></hr>
            <input type="text" placeholder="enter" id="search"></input>
            <button type="button" onClick={click}>search</button>
        <Switch>
            <Route path={`${match.path}/:id/`}>
                <Result />
            </Route>
            <Route path={match.path}>
                <h3>Please select a topic.</h3>
            </Route>
        </Switch>
    </div>

    );
}

function Result() {
    let { id } = useParams();
    let match = useRouteMatch();
    var result = null;
    console.log(id);
    // searchResult(id).then(res => console.log(res));
    // console.log(result.data.Page.media[0].title.native);
    console.log(result);
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
        AnimeQuery.searchAnime(this.state.id, 20, 1)
            .then(res => {
                const result = [];
                var list = res.data.Page.media;
                list.forEach(element => {
                    result.push(<div id={element.id} className="anime-block"><img src={element.coverImage.large} className="anime-img"></img><br></br><p className="anime-title">{element.title.native}</p></div>);
                });
                this.setState({ result: result });
            });
    }

    render() {
        return (
            <div className="flex-container">
                {this.state.result}
            </div>
        );
    }
}

export default Search;