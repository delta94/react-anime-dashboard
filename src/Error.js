import React from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";

const Error = () => {
    let match = useRouteMatch();
    let location = useLocation();
    console.log(match.url);
    return (
        <Navbar>
            <div>
                <h1>Error! Wrong Page!</h1>
                <h2>
                    Wrong URL: <code>{match.url}</code>
                </h2>
                <h2>
                    No match for <code>{location.pathname}</code>
                </h2>
            </div>
        </Navbar>
    );
}

export default Error;