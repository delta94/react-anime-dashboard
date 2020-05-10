import React from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from './Navbar';
import MediaList from "./MediaList";
import { Container} from 'semantic-ui-react';

class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.defaultConfig = null;
        if (props.location.data) {
            this.defaultConfig = props.location.data;
        } else {
            this.defaultConfig = {
                type: 'anime',
                sort: 'popularity_desc',
            };
        }
        
    }

    render() {
        return (
            <Navbar active="anime" {...this.props}>
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