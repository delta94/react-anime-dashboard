import React from 'react';
import AnimeQuery from './components/AnimeQuery';
import Navbar from './components/Navbar';
import { Container } from 'semantic-ui-react';

class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            src: "",
            title: "",
            coverImg: "",
            result: null
        };
    }

    // execute this function before call render
    componentWillMount() {
      AnimeQuery.getAllMedia("anime", 50, 1).then((res) => {
        const result = [];
        var list = res.data.Page.media;
        list.forEach((element) => {
          result.push(
              <div id={element.id} key={element.id} className="anime-block">
                  <img
                      src={element.coverImage.large}
                      className="anime-img"
                  ></img>
                  <div className="anime-title">{element.title.native}</div>
                  <div className="anime-title">{element.title.english}</div>
              </div>
          );
        });
        this.setState({ result: result });
      });
    }

    render() {
        return (
            <Navbar active="anime">
                <Container>
                    <h1 style={{ textAlign: "center", color: "white" }}>All Anime</h1>
                    <div className="flex-container">{this.state.result}</div>
                </Container>
            </Navbar>
        );
    }
}

export default Anime;