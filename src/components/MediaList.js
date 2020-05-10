import React from "react";
import AnimeQuery from "./AnimeQuery";
import MediaModal from './MediaModal';
import { ErrorBox } from './Error';
import { Button, Icon } from "semantic-ui-react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import style from './MediaList.module.scss';

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
            searchText: '',
            error: false,
            errorTitle: 'Error!',
            errorMessage: 'Please try again later ...',
        };

        this.config = null;
        if (props.config) {
            this.config = props.config;
        } else {
            this.config = {
                sort: "id"
            }
        }
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

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if received new search key
        if (this.props.searchKey !== nextProps.searchKey) {
            // reset config
            this.config = {
                search: nextProps.searchKey,
            };
            let key = nextProps.searchKey;
            if (key !== '') {
                AnimeQuery.getCustomMedia(25, 1, this.config)
                    .then((res) => {
                        if (res.data.Page.pageInfo.total !== 0) {
                            this.handleResult(res, true);
                            this.addLoadMore(true, false);
                            this.setState({
                                error: false,
                                searchText: 'for "' + key + '"',
                                ResultNum: res.data.Page.pageInfo.total,
                            });
                        } else {
                            this.handleError('No Result For "' + key + '"', 'NOT FOUND', 'No Result For "' + key + '"');
                        }
                    })
                    .catch((err) => this.handleError(err));
            }
        }
    }

    // execute before the very beginning render, for frist time only
    UNSAFE_componentWillMount() {
        if (this.props.type === "search") {
            var key = this.props.searchKey;
            if (key !== "") {
                AnimeQuery.getCustomMedia(25, 1, this.config)
                    .then((res) => {
                        if (res.data.Page.pageInfo.total !== 0) {
                            this.handleResult(res);
                            this.addLoadMore(true, false);
                            this.setState({
                                searchText: 'for "' + key + '"',
                                ResultNum: res.data.Page.pageInfo.total,
                            });
                        } else {
                            this.handleError('No Result For "' + key + '"', 'NOT FOUND', 'No Result For "' + key + '"');
                        }
                    })
                    .catch((err) => this.handleError(err));
            }

        } else {
            AnimeQuery.getCustomMedia(50, 1, this.config)
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

    handleResult = (res, reset) => {
        const result = [];
        let resetFlag = false;
        if (reset && reset === true) {
            resetFlag = true;
        }
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
            content: (resetFlag ? result : this.state.content.concat(result)),
            currentPage: res.data.Page.pageInfo.currentPage,
            hasNext: res.data.Page.pageInfo.hasNextPage,
        });
    }

    handleError = (err, errTitle, errMessage) => {
        console.log(err);
        this.setState({
            error: true,
            content: [],
            errorTitle: (errTitle ? errTitle : this.state.errorTitle),
            errorMessage: (errMessage ? errMessage : this.state.errMessage),
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
                {!this.state.error &&
                    <h3 style={{ color: 'white' }}>
                        Total {this.state.ResultNum} results {this.state.searchText}
                    </h3>
                }
                {!this.state.error ? (
                    <React.Fragment>
                        <div className="flex-container">
                            {this.state.content}
                        </div>
                        {this.state.loadmore}
                    </React.Fragment>
                ) : (
                    <ErrorBox title={this.state.errorTitle} text={this.state.errorMessage} />
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
                <div className="anime-img-block">
                    {/* <img id={id} src={img} alt={alt} onClick={click}></img> */}
                    <LazyLoadImage
                        id={id}
                        src={img}
                        alt={alt}
                        onClick={click}
                        className={"anime-img"}
                        threshold={100}
                        effect="myblur"
                    />
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