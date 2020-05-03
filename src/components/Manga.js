import React from "react";
import Navbar from "./Navbar";
import MediaList from './MediaList';
import { Container } from "semantic-ui-react";

class Manga extends React.Component {
    constructor(props) {
        super(props);
        this.defaultConfig = {
            type: "manga",
            sort: "popularity_desc",
        };
    }

    render() {
        return (
            <Navbar active="manga">
                <Container>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                        All Manga
                    </h1>
                    <MediaList type="manga" config={this.defaultConfig} />
                </Container>
            </Navbar>
        );
    }
}

export default Manga;