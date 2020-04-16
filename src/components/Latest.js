import React from 'react';
import AnimeQuery from './AnimeQuery';

class Latest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null
        };
    }

    componentWillMount() {
        AnimeQuery.getMediaByLatest("anime", 50, 1)
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
            <div>
                <h1 style={{ textAlign: "center" }}>Latest Anime</h1>
                <div className="flex-container">
                    {this.state.result}
                </div>
            </div>
        );
    }
}

export default Latest;