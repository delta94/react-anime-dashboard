import React from 'react';
import { useParams, useRouteMatch, Switch, Route, Link } from 'react-router-dom';

const Error = () => {
    let match = useRouteMatch();
    console.log(match.url);
    return (
        <h1>Error! Wrong Page!</h1>
    );
}

export default Error;