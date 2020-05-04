import React from "react";
import AnimeQuery from "./AnimeQuery";
import MediaModal from './MediaModal';
import { ErrorBox } from './Error';
import {
    Button,
    Image,
    Icon,
    Card,
    Loader,
    Grid,
    Label
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
            ResultNum: 0,
            searchText: "",
            error: false
        };
        this.config = props.config;
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
                AnimeQuery.getCustomMedia(25, this.state.currentPage + 1, this.config)
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
            AnimeQuery.getCustomMedia(50, this.state.currentPage + 1, this.config)
                .then((res) => {
                    this.handleResult(res);
                    this.addLoadMore(true, false);
                    this.setState({
                        ResultNum: res.data.Page.pageInfo.total
                    });
                })
                .catch(err => this.handleError(err));
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
            currentPage: res.data.Page.pageInfo.currentPage,
            hasNext: res.data.Page.pageInfo.hasNextPage,
        });
    }

    handleError = (err) => {
        this.setState({
            error: true,
            content: [],
        });
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
            let num = (this.props.type === 'search' ? 25 : 50);
            AnimeQuery.getCustomMedia(
                num,
                this.state.currentPage + 1,
                this.config
            ).then((res) => {
                this.handleResult(res);
                this.addLoadMore(true, false);
            })
            .catch(err => this.handleError(err));
        } else {
            this.addLoadMore(false, false);
            console.log("The End!");
        }
    };

    render() {
        return (
            <div>
                <h3 style={{ color: "white" }}>
                    Total {this.state.ResultNum} results {this.state.searchText}
                </h3>
                {!this.state.error ? (
                    <React.Fragment>
                        <div className="flex-container">
                            {this.state.content}
                        </div>
                        {this.state.loadmore}
                    </React.Fragment>
                ) : (
                    <ErrorBox text='Please try again later ...' />
                )}

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
        const { id, img, native, romaji, english, click, location, label} = this.props;
        var alt = (english ? english : romaji ? romaji : native);
        var firstTitle = (native ? native : romaji);
        var secondTitle = (english ? english : native ? romaji : '');
        var locStyle = (location ? (location === 'home' ? 'home-anime-block' : 'anime-block') : 'anime-block');
        var mylabel = (label ? label : null); 

        return (
            <div key={id} className={locStyle}>
                <div className="anime-img">
                    <img id={id} src={img} alt={alt} onClick={click}></img>
                </div>
                <div className="anime-title">{firstTitle}</div>
                <div className="anime-title">{secondTitle}</div>
                {mylabel}
            </div>
        );
    }
}
export default MediaList;
export { OneMedia };