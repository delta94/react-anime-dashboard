import React from 'react';
import AnimeQuery from './components/AnimeQuery';

class Anime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            src: "",
            title: "",
            coverImg: ""
        };
    }

    // execute this function before call render
    componentWillMount() {
      AnimeQuery.getAnimeByID(106286)
        .then(res => {
          this.setState({
            apiRes: JSON.stringify(res),
            src: res.data.Media.bannerImage,
            title: res.data.Media.title.native,
            coverImg: res.data.Media.coverImage.extraLarge
          });
        });
    }

    render() {
        return (
            <div>
                <p>{this.state.apiRes}</p>
                <hr></hr>
                <h2>{this.state.title}</h2>
                <img src={this.state.src} width="60%"></img>
                <br></br>
                <img src={this.state.coverImg}></img>
            </div>
        );
    }
}

export default Anime;