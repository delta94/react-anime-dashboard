import React from 'react';
import Navbar from './Navbar';
import MediaList from "./MediaList";
import { Container} from 'semantic-ui-react';

class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.defaultConfig = {
            type: 'anime',
            sort: 'popularity_desc'
        };
    }

    render() {
        return (
            <Navbar active="anime">
                <Container>
                    <h1 style={{ textAlign: "center", color: "white" }}>
                        All Anime
                    </h1>
                    <MediaList type="anime" config={this.defaultConfig} />
                </Container>
            </Navbar>
        );
    }
}

export default Anime;