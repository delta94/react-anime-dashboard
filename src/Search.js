import React from 'react';
import { useParams, useRouteMatch, Switch, Route, Link } from 'react-router-dom';


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
            <Route path={`${match.path}/:id`}>
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
        }
    }

    componentWillMount() {
        searchResult(this.state.id).then(res => this.setState({result: res}));
    }

    render() {
        return (
            <div>
                {this.state.result}
            </div>
        );
    }
}


function searchResult(searchKey) {
    var query = `
        query ($key: String) {
            Page(perPage: 12, page: 1) {
                pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
                }
                media (type: ANIME, search: $key) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    bannerImage
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                }
            }
        }`;

    var variables = {
        key: searchKey
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };
    
    async function callAPI() {
        try {
            const response = await fetch(url, options);
            const res = await handleResponse(response);
            return handleData(res);
        }
        catch (error) {
            return handleError(error);
        }
    }

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(res) {
        console.log(res);
        const result = [];
        var list = res.data.Page.media;
        list.forEach(element => {
            result.push(<span id={element.id} style={{display: "inline-block", margin: "10px", width: "20%"}}><img src={element.coverImage.large} style={{width: "220px", height: "300px"}}></img><br></br><p>{element.title.native}</p></span>);
        });
        console.log(result);
        return result;
    }

    function handleError(error) {
        alert('Error, check console');
        console.error(error);
    }

    return callAPI();
}

export default Search;