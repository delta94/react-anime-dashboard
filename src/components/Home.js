import React from 'react';
import $ from 'jquery';
import { Button, Container, Label, Divider, Icon } from "semantic-ui-react";
import Navbar from './Navbar';
import AnimeQuery from "./AnimeQuery";
import MediaModal from './MediaModal';
import HomeSubSection from './HomeSubSection';
import { Link } from 'react-router-dom';

// const variable to set how many elements to show in each section.
const PopularElementNumber = 20;
const LatestElementNumber = 20;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentID: -1,
            openModal: false,
            resetModal: false,
        };
    }

    handleExplore = () => {
        $("html, body").animate({ scrollTop: $('#home-img').height() - $('#outer-nav').height()  }, 1000);
    }

    handleOpenModal = (event) => {
        if (event.target.id) {
            let id = event.target.id.split('-');
            let myID = id[1];
            myID = parseInt(myID);
            this.setState({
                currentID: myID,
                openModal: true,
                resetModal: false,
            });
        }
    }

    handleCloseModal = () => {
        this.setState({
            openModal: false,
            resetModal: true,
        });
    }

    render() {
        return (
            <Navbar active="home" {...this.props}>
                <div className="home-img" id="home-img">
                    <Container>
                        <div className="home-content">
                            <div className="home-title">
                                <Button
                                    as="a"
                                    circular
                                    icon
                                    color="red"
                                    // labelPosition='right'
                                    size="massive"
                                    className="explore-btn"
                                    onClick={this.handleExplore}
                                >
                                    <span>Explore ANIME</span>
                                    <Icon name="angle double down" />
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>

                <Container id="home-main" className="main-container">
                    <CurrentSeasonSection clickOpenModal={this.handleOpenModal}/>
                    <Divider></Divider>
                    <PopularAnimeSection clickOpenModal={this.handleOpenModal} />
                    <Divider></Divider>
                    <PopularMangaSection clickOpenModal={this.handleOpenModal} />
                    <div style={{ height: '10vh' }}></div>
                </Container>

                <MediaModal
                    id={this.state.currentID}
                    open={this.state.openModal}
                    close={this.handleCloseModal}
                    reset={this.state.resetModal}
                />
            </Navbar>
        );
    }
}

class PopularAnimeSection extends React.Component {
    constructor() {
        super();
        this.config = {
            type: 'Anime',
            sort: 'Popularity',
            popularity: true,
        };
        this.title = 'POPULAR ANIME';
        this.pathname = '/anime';
        this.elementNumber = PopularElementNumber;
    }

    render() {
        return (
            <PopularSection
                config={this.config}
                title={this.title}
                pathname={this.pathname}
                elementNumber={this.elementNumber}
                clickOpenModal={this.props.clickOpenModal}
            />
        );
    }
}

class PopularMangaSection extends React.Component {
    constructor() {
        super();
        this.config = {
            type: 'Manga',
            sort: 'Popularity',
            popularity: true,
        };
        this.title = 'POPULAR MANGA';
        this.pathname = '/manga';
        this.elementNumber = PopularElementNumber;
    }

    render() {
        return (
            <PopularSection
                config={this.config}
                title={this.title}
                pathname={this.pathname}
                elementNumber={this.elementNumber}
                clickOpenModal={this.props.clickOpenModal}
            />
        );
    }
}


class PopularSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            labels: [],
            numElements: props.elementNumber,
        }
        this.config = props.config;
    }

    handleContent = () => {
        AnimeQuery.getCustomMedia(this.state.numElements, 1, this.config)
            .then((res) => {
                if (res.data) {
                    let list = res.data.Page.media;
                    let contentList = [];
                    let labelList = [];
                    list.forEach((element) => {
                        contentList.push(element);
                        labelList.push(
                            <RibbonLabel
                                text={element.popularity}
                                default={'Popular'}
                                color={'red'}
                                icon={'star'}
                            />
                        );
                    });
                    this.setState({
                        content: contentList,
                        labels: labelList,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    UNSAFE_componentWillMount() {
        this.handleContent();
    }

    render() {
        return (
            <div>
                <div className="block-title">
                    <Link to={{ pathname: this.props.pathname, data: this.props.config }}>
                        <Label
                            color="red"
                            tag
                            size="massive"
                            className="title-tag"
                        >
                            <Icon name="star" />
                            <span>{this.props.title}</span>
                        </Label>
                    </Link>
                </div>
                <HomeSubSection
                    content={this.state.content}
                    labelList={this.state.labels}
                    sectionName="popular"
                    clickOpenModal={this.props.clickOpenModal}
                    num={this.state.numElements}
                />
            </div>
        );
    }
}

class CurrentSeasonSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            labels: [],
            numElements: LatestElementNumber,
        };
        this.config = {
            type: 'Anime',
            sort: 'Popularity',
            nextAiringEpisode: true,
        };
        this.seasonMeta = {};
    }

    handleSeasonMeta = () => {
        const { season, seasonYear } = getCurrentSeason();
        this.config.seasonYear = seasonYear;
        this.config.season = season;
        if (season === 'Spring') {
            this.seasonMeta = {
                iconName: 'tree',
                seasonSectionTitle: `SPRING ${seasonYear}`,
                seasonColor: 'green',
            }
        } else if (season === 'Summer') {
            this.seasonMeta = {
                iconName: 'sun',
                seasonSectionTitle: `SUMMER ${seasonYear}`,
                seasonColor: 'blue',
            };
        } else if (season === 'Fall') {
            this.seasonMeta = {
                iconName: 'leaf',
                seasonSectionTitle: `FALL ${seasonYear}`,
                seasonColor: 'yellow',
            };
        } else {
            this.seasonMeta = {
                iconName: 'snowflake outline',
                seasonSectionTitle: `WINTER ${seasonYear}`,
                seasonColor: 'teal',
            };
        }
        this.seasonMeta.season = season;
        this.seasonMeta.seasonYear = seasonYear;
    }

    handleContent = () => {
        this.handleSeasonMeta();
        AnimeQuery.getCustomMedia(this.state.numElements, 1, this.config)
            .then((res) => {
                if (res.data) {
                    let list = res.data.Page.media;
                    let contentList = [];
                    let labelList = [];
                    list.forEach((element) => {
                        contentList.push(element);
                        let text = getNextEpTime(element.nextAiringEpisode);
                        labelList.push(
                            <RibbonLabel
                                default={this.seasonMeta.season + ' ' + this.seasonMeta.seasonYear}
                                color={this.seasonMeta.seasonColor}
                                icon={this.seasonMeta.iconName}
                                text={text}
                            />
                        );
                    });
                    this.setState({
                        content: contentList,
                        labels: labelList,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    UNSAFE_componentWillMount() {
        this.handleContent();
    }

    render() {
        return (
            <div>
                <div className="block-title">
                    <Link to={{ pathname: '/anime', data: this.config }}>
                        <Label
                            color={this.seasonMeta.seasonColor}
                            tag
                            size="massive"
                            className="title-tag"
                        >
                            <Icon name={this.seasonMeta.iconName} />
                            {this.seasonMeta.seasonSectionTitle}
                        </Label>
                    </Link>
                </div>
                <HomeSubSection
                    content={this.state.content}
                    labelList={this.state.labels}
                    sectionName="season"
                    clickOpenModal={this.props.clickOpenModal}
                    num={this.state.numElements}
                />
            </div>
        );
    }
}

const RibbonLabel = (props) => {
    let text = props.text ? props.text : props.default;
    return (
        <Label as="a" color={props.color} ribbon className="myRibbon">
            <Icon name={props.icon} />
            {text}
        </Label>
    );
}

const getCurrentSeason = () => {
    let today = new Date();
    let seasonYear = today.getFullYear().toString();
    let month = today.getMonth() + 1;
    let season = '';
    if (month >= 1 && month <= 3) season = 'Winter'; // 1 - 3
    else if (month >= 4 && month <= 6) season = 'Spring'; // 4 - 6
    else if (month >= 7 && month <= 9) season = 'Summer'; // 7 - 9
    else if (month >= 10 && month <= 12) season = 'Fall';  // 10 - 12
    else season = '';

    return { season: season, seasonYear: seasonYear };
};

const getNextEpTime = (element) => {
    if (!element) {
        return null;
    }

    let episode = element.episode;
    let timeInSecond = element.timeUntilAiring;
    let day = Math.floor(timeInSecond / (60 * 60 * 24)); // seconds in one day
    timeInSecond = timeInSecond - (day * 60 * 60 * 24);
    let hour = Math.floor(timeInSecond / 3600);
    timeInSecond = timeInSecond - hour * 3600;
    let minute = Math.floor(timeInSecond / 60);
    timeInSecond = timeInSecond - minute * 60;

    return `EP ${episode}: ${day === 0 ? '' : day + ' d'} ${hour === 0 ? '' : hour + ' h'} ${minute === 0 ? '' : minute + ' m'} ${timeInSecond + ' s'}`;
}

export default Home;
