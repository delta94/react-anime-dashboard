import React from 'react';
import AnimeQuery from './components/AnimeQuery';

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
              <img src={element.coverImage.large} className="anime-img"></img>
              <br></br>
              <p className="anime-title">{element.title.native}</p>
            </div>
          );
        });
        this.setState({ result: result });
      });
    }

    render() {
        return (
          <div>
            <h1 style={{ textAlign: "center" }}>All Anime</h1>
            <div className="flex-container">{this.state.result}</div>
          </div>
        );
    }
}

export default Anime;