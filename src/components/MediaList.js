import React from "react";
import AnimeQuery from "./AnimeQuery";
import MediaModal from './MediaModal';
import {
    Button,
    Image,
    Icon,
    Card,
    Loader,
} from "semantic-ui-react";
import style from "./MediaList.module.scss";

class MediaList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            hasNextPage: true,
            currentPage: 0,
            id: -1,
            open: false,
            reset: false,
            loadmore: null,
            runQuery: null,
            ResultNum: 0,
            searchText: "",
            error: false
        };
    }

    getId = (event) => {
        console.log("onclicked getID = " + event.target.id);
        // set state to open the modal
        this.setState({
            id: event.target.id,
            open: true,
            reset: false,
        });
    };

    // to close the modal and reset content in the modal
    close = () => {
        this.setState({
            open: false,
            reset: true,
        });
    };

    // execute before the very beginning render, for frist time only
    UNSAFE_componentWillMount() {
        if (this.props.type === "search") {
            var key = this.props.searchKey;
            if (key !== "") {
                AnimeQuery.searchMedia(key, 25, this.state.current + 1)
                    .then((res) => {
                        this.handleResult(res);
                        this.addLoadMore(true, false);
                        this.setState({
                            searchText: 'for "' + key + '"',
                            ResultNum: res.data.Page.pageInfo.total,
                        });
                    })
                    .catch((err) => this.handleError(err));
            }

        } else {
            var runQuery;
            if (this.props.type === "anime")
                runQuery = AnimeQuery.getAllAnimeByPopularity;
            else if (this.props.type === "manga")
                runQuery = AnimeQuery.getAllManga;
            else runQuery = null;

            if (runQuery) {
                runQuery(50, 1)
                    .then((res) => {
                        this.handleResult(res);
                        this.addLoadMore(true);
                        this.setState({
                            runQuery: runQuery,
                            ResultNum: res.data.Page.pageInfo.total
                        });
                    })
                    .catch(err => this.handleError(err));
            }
        }
    }

    handleResult = (res) => {
        const result = [];
        var list = res.data.Page.media;
        list.forEach((element) => {
            result.push(
                <OneMedia
                    key={element.id}
                    id={element.id}
                    img={element.coverImage.large}
                    native={element.title.native}
                    romaji={element.title.romaji}
                    english={element.title.english}
                    click={this.getId}
                />
            );
        });

        this.setState({
            content: this.state.content.concat(result),
            current: res.data.Page.pageInfo.currentPage,
            hasNext: res.data.Page.pageInfo.hasNextPage,
        });
    }

    handleError = (err) => {
        this.setState({ error: true });
    }

    addLoadMore = (status, loading) => {
        this.setState({
            loadmore: (<LoadMore
                addComponent={this.addComponent}
                loadmoreYes={status}
                loading={loading} />)
        });
    }

    addComponent = () => {
        this.addLoadMore(true, true);
        if (this.state.hasNext) {
            if (this.props.type === 'search') {
                AnimeQuery.searchMedia(
                    this.props.searchKey,
                    25,
                    this.state.current + 1
                ).then((res) => {
                    this.handleResult(res);
                    this.addLoadMore(true, false);
                })
                .catch(err => this.handleError(err));

            } else {
                this.state.runQuery(
                    50,
                    this.state.current + 1
                ).then((res) => {
                    this.handleResult(res);
                    this.addLoadMore(true, false);
                }).catch(err => this.handleError(err));
            }
        } else {
            this.addLoadMore(false, false);
            console.log("The End!");
        }
    };

    render() {
        return (
            <div>
                <h3 style={{color: "white"}}>showing {this.state.ResultNum} results {this.state.searchText}</h3> 
                <div className="flex-container">{this.state.content}</div>
                {this.state.loadmore}
                <MediaModal
                    id={this.state.id}
                    open={this.state.open}
                    close={this.close}
                    reset={this.state.reset}
                />
            </div>
        );
    }
}

const LoadMore = (props) => {
    var loadmoreText;
    if (props.loadmoreYes) {
        loadmoreText = (
            <Button
                onClick={props.addComponent}
                className={style.loadmoreBtn}
                primary
                loading={props.loading}
                circular
                icon
                labelPosition="right"
            >
                Load More
                <Icon name="angle double down" />
            </Button>
        );
    } else {
        loadmoreText = (
            <Button className={style.loadmoreBtn} primary circular>
                The End
            </Button>
        );
    }

    return (
        <div className={style.loadmoreBlock}>
            {loadmoreText}
        </div>
    );
    
}   

class OneMedia extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, img, native, romaji, english, click} = this.props;
        var alt = (english ? english : romaji ? romaji : native);
        var firstTitle = (native ? native : romaji);
        var secondTitle = english;

        return (
            <div key={id} className="anime-block">
                <div className="anime-img">
                    <img
                        id={id}
                        src={img}
                        alt={alt}
                        onClick={click}
                    ></img>
                </div>
                <div className="anime-title">{firstTitle}</div>
                <div className="anime-title">{secondTitle}</div>
            </div>
        );
    }
}

export default MediaList;