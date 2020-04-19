import React from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
import { Container } from 'semantic-ui-react';

const Error = () => {
    let match = useRouteMatch();
    let location = useLocation();
    console.log(match.url);
    return (
        <Navbar>
            <Container>
                <h1>Error! Wrong Page!</h1>
                <h2>
                    Wrong URL: <code>{match.url}</code>
                </h2>
                <h2>
                    No match for <code>{location.pathname}</code>
                </h2>
            </Container>
        </Navbar>
    );
}

export default Error;