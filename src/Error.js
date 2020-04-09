import React from 'react';
import { useParams, useRouteMatch, Switch, Route, Link, useLocation} from 'react-router-dom';

const Error = () => {
    let match = useRouteMatch();
    let location = useLocation();
    console.log(match.url);
    return (
        <div>
            <h1>Error! Wrong Page!</h1>
            <h2>Wrong URL: <code>{match.url}</code></h2>
            <h2>No match for <code>{location.pathname}</code></h2>
        </div>
    );
}

export default Error;