import React from "react";
import AnimeQuery from "./AnimeQuery";
import Navbar from "./Navbar";

class Manga extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiRes: "",
            src: "",
            title: "",
            coverImg: "",
            result: null,
        };
    }

    // execute this function before call render
    componentWillMount() {
        AnimeQuery.getAllMedia("manga", 50, 1).then((res) => {
            const result = [];
            var list = res.data.Page.media;
            list.forEach((element) => {
                result.push(
                    <div
                        id={element.id}
                        key={element.id}
                        className="anime-block"
                    >
                        <img
                            src={element.coverImage.large}
                            className="anime-img"
                        ></img>
                        <div className="anime-title">
                            {element.title.native}
                        </div>
                        <div className="anime-title">
                            {element.title.english}
                        </div>
                    </div>
                );
            });
            this.setState({ result: result });
        });
    }

    render() {
        return (
            <Navbar active="manga">
                <div>
                    <h1 style={{ textAlign: "center", color: "white" }}>All Manga</h1>
                    <div className="flex-container">{this.state.result}</div>
                </div>
            </Navbar>
        );
    }
}

export default Manga;
