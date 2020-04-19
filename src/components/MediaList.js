import React from "react";
import AnimeQuery from "./AnimeQuery";
import paragraph from '../images/paragraph.png';
import {
    Container,
    Button,
    Modal,
    Image,
    Icon,
    Header,
    Card,
    Loader,
    Segment,
    Dimmer,
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
            searchText: ""
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

    handleSearch = (key) => {
        if (key !== "") {
            if (this.state.hasNextPage) {
                AnimeQuery.searchMedia(key, 25, this.state.current+1).then((res) => {
                    this.handleResult(res);
                });
            }
        }
    }

    // execute before the very beginning render, execute once
    UNSAFE_componentWillMount() {
        if (this.props.type === "search") {
            var key = this.props.searchKey;
            if (key !== "") {
                AnimeQuery.searchMedia(key, 25, this.state.current+1).then((res) => {
                    this.handleResult(res);
                    this.addLoadMore();
                    this.setState({
                        searchText: 'for "' + key + '"',
                        ResultNum: res.data.Page.pageInfo.total
                    });
                });
            }

        } else {
            var runQuery;
            if (this.props.type === "anime")
                runQuery = AnimeQuery.getAllAnimeByPopularity;
            else if (this.props.type === "manga")
                runQuery = AnimeQuery.getAllManga;
            else runQuery = null;

            if (runQuery) {
                runQuery(50, 1).then((res) => {
                    this.handleResult(res);
                    this.addLoadMore();
                    this.setState({
                        runQuery: runQuery,
                        ResultNum: res.data.Page.pageInfo.total
                    });
                });
            }
        }
    }

    handleResult = (res) => {
        const result = [];
        var list = res.data.Page.media;
        list.forEach((element) => {
            result.push(
                <div key={element.id} className="anime-block">
                    <div className="anime-img">
                        <img
                            id={element.id}
                            src={element.coverImage.large}
                            alt={element.title.english}
                            onClick={this.getId}
                        ></img>
                    </div>
                    <div className="anime-title">
                        {element.title.native}
                    </div>
                    <div className="anime-title">
                        {element.title.english}
                    </div>
                </div>
            );
        });

        this.setState({
            content: this.state.content.concat(result),
            current: res.data.Page.pageInfo.currentPage,
            hasNext: res.data.Page.pageInfo.hasNextPage,
        });
    }

    addLoadMore = () => {
        this.setState({
            loadmore: (<LoadMore addComponent={this.addComponent} />)
        });
    }

    addComponent = () => {
        if (this.state.hasNext) {
            if (this.props.type === 'search') {
                this.handleSearch(this.props.searchKey);
            } else {
                this.state.runQuery(
                    50,
                    this.state.current + 1
                ).then((res) => {
                    this.handleResult(res);
                });
            }
        } else {
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
    return (
        <div className={style.loadmoreBlock}>
            <Button onClick={props.addComponent} className={style.loadmoreBtn}>
                Load More
                <Icon name="angle double down" className={style.loadmoreIcon}></Icon>
            </Button>
        </div>
    );
    
}   

class OneMedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            img: props.img,
            native: props.native,
            english: props.english,
        };
    }

    render() {
        const { id, img, native, english } = this.state;
        return (
            <div id={id} key={id} className="anime-block">
                <img src={img} alt={english} className="anime-img"></img>
                <div className="anime-title">{native}</div>
                <div className="anime-title">{english}</div>
            </div>
        );
    }
}


/**
 * A single media box for displaying information for a single media
 */
class MediaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            banner: "",
            media: null
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            console.log("current id == " + this.props.id);
            console.log("will receive id == " + nextProps.id);
            AnimeQuery.getMediaByID(nextProps.id).then((res) => {
                this.setState({
                    id: nextProps.id,
                    banner: res.data.Media.bannerImage,
                    media: res.data.Media
                });
            });
        }

        if (nextProps.reset) {
            this.setState({
                id: null,
                banner: "",
                media: null
            });
        }
    }

    render() {
        const { media } = this.state;
        if (media) {
            return (
                <Modal
                    id="modal"
                    open={this.props.open}
                    onClose={this.props.close}
                    closeOnDimmerClick={true}
                // closeIcon
                >
                    <div className={style.modalBanner}>
                        <img
                            src={this.state.banner}
                            alt={media.title.english}
                            className={style.modalBannerImg}
                        ></img>
                        {/* <div style={{backgroundImage: "url("+this.state.banner+")"}} className={style.modalBannerImg}></div> */}
                    </div>

                    <Container className={style.modalContent}>
                        <div className={style.modalTitle}>
                            <div className={style.modalNative}>{media.title.native}</div>
                            <div className={style.modalRomaji}>({media.title.romaji})</div>
                            <div className={style.modalEnglish}>{media.title.english}</div>
                            
                        </div>
                        

                        <Header>{this.state.id}</Header>
                    </Container>

                    <Modal.Actions>
                        <Button negative onClick={this.props.close}>
                            Close <Icon name="chevron right" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        } else {
            return (
                <Modal
                    id="modal"
                    open={this.props.open}
                    onClose={this.props.close}
                    closeOnDimmerClick={true}
                >
                    <Modal.Content image scrolling>
                        <Segment className={style.loadingBox}>
                            <Dimmer active inverted>
                                <Loader inverted size="large">
                                    Loading
                                </Loader>
                            </Dimmer>

                            <Image
                                src={paragraph}
                                alt="p"
                                className={style.paragraph}
                            />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.props.close}>
                            Close <Icon name="chevron right" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        }
    }
}

export default MediaList;