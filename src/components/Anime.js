import React from 'react';
import Navbar from './Navbar';
import MediaList from "./MediaList";
import { Container, Button, Modal, Image, Icon, Header } from 'semantic-ui-react';

class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
        };
    }

    render() {
        return (
            <Navbar active="anime">
                <Container>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                        All Anime
                    </h1>
                    <MediaList type="anime" />
                </Container>
            </Navbar>
        );
    }
}

export default Anime;