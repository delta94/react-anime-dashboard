import React from 'react';
import $ from 'jquery';
import { Button, Container, Label, Divider, Grid, Icon } from "semantic-ui-react";
import Navbar from './components/Navbar';
import AnimeQuery from "./components/AnimeQuery";
import tempimg from './images/page-not-found.png';
import { OneMedia } from './components/MediaList';
import MediaModal from './components/MediaModal';

// const variable to set how many elements to show in each section.
const PopularElementNumber = 15;
const LatestElementNumber = 15;

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
        $("html, body").animate({ scrollTop: $('#home-img').height() - $('#outer-nav').height() - 5 }, 1000);
    }

    handleOpenModal = (event) => {
        if (event.target.id) {
            console.log(event.target.id);
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
            <Navbar active="home">
                <div className="home-img" id="home-img">
                    <Container>
                        <div className="home-content">
                            <div className="home-title">
                                <Label
                                    as="a"
                                    circular
                                    size="massive"
                                    className="aa"
                                    onClick={this.handleExplore}
                                >
                                    Explore ANIME
                                </Label>
                            </div>
                        </div>
                    </Container>
                </div>

                <Container id="home-main" className="main-container">
                    <PopularSection clickOpenModal={this.handleOpenModal} />
                    <Divider></Divider>
                    <div style={{ height: "100vh" }}></div>
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


class PopularSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            labels: [],
            numElements: PopularElementNumber
        }
    }

    handleContent = () => {
        const config = {
            type: "anime",
            sort: 'popularity_desc',
            popularity: true,
        };

        AnimeQuery.getCustomMedia(this.state.numElements, 1, config)
            .then((res) => {
                if (res.data) {
                    let list = res.data.Page.media;
                    let contentList = [];
                    let labelList = [];
                    list.forEach((element) => {
                        contentList.push(element);
                        labelList.push(
                            <PopularLabel text={element.popularity} />
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

    componentWillMount() {
        this.handleContent();
    }

    render() {
        return (
            <div>
                <div className="block-title">
                        <Label as='a' color='red' tag size="massive" className="title-tag">
                            <Icon name="star" />
                            Popular Anime
                        </Label>
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


class HomeSubSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnNum: 5,
            visibleArray: [],
            content: [],
            labelList: [],
            numElements: props.num,
        };
        this.colNum = 5;
        this.tempArray = [];
        for (let i = 0; i < props.num; ++i) {
            this.tempArray.push(false);
        }
        this.sectionName = props.sectionName;
        this.startHandleVisible = false;
    }

    handleResize = () => {
        if (window.innerWidth >= 1200) {
            if (this.colNum !== 5) {
                let prev = this.colNum;
                this.colNum = 5;
                this.handleResizeVisible(prev, this.colNum);
                this.setState({ columnNum: 5 });
            }
        } else if (window.innerWidth >= 992) {
            if (this.colNum !== 4) {
                let prev = this.colNum;
                this.colNum = 4;
                this.handleResizeVisible(prev, this.colNum);
                this.setState({ columnNum: 4 });
            }
        } else if (window.innerWidth >= 640) {
            if (this.colNum !== 3) {
                let prev = this.colNum;
                this.colNum = 3;
                this.handleResizeVisible(prev, this.colNum);
                this.setState({ columnNum: 3 });
            }
        } else {
            if (this.colNum !== 2) {
                let prev = this.colNum;
                this.colNum = 2;
                this.handleResizeVisible(prev, this.colNum);
                this.setState({ columnNum: 2 });
            }
        }
    };

    handleResizeVisible = (currentCol, nextCol) => {
        if (this.startHandleVisible) {
            let startIndex = 0;
            for (let i = 0; i < this.state.numElements; ++i) {
                if (this.tempArray[i] === true) {
                    startIndex = i;
                    break;
                }
            }
            let lastIndex = startIndex + (currentCol - 1);
            if (currentCol > nextCol) {
                // shrink list
                let interval = currentCol - nextCol;
                for (let i = 0; i < interval; ++i) {
                    this.tempArray[lastIndex - i] = false;
                }
            } else {
                // expand list
                let interval = nextCol - currentCol;
                for (let i = 0, j = 1; i < interval; ++i) {
                    if (lastIndex === this.state.numElements - 1) {
                        this.tempArray[startIndex - j] = true;
                        ++j;
                    } else {
                        lastIndex += i;
                        this.tempArray[lastIndex + 1] = true;
                    }
                }
            }
            this.setState({ visibleArray: this.tempArray });
        }
    };

    handlePrev = () => {
        if (this.tempArray[0] === false) {
            let index = 0;
            for (let i = 0; i < this.state.numElements; ++i) {
                if (this.tempArray[i] === true) {
                    index = i;
                    break;
                }
            }
            let lastIndex = index + (this.colNum - 1);
            this.tempArray[index - 1] = true;
            this.tempArray[lastIndex] = false;
            this.setState({ visibleArray: this.tempArray });
        }
    };

    handleNext = () => {
        if (this.tempArray[this.state.numElements - 1] === false) {
            let index = 0;
            for (let i = 0; i < this.state.numElements; ++i) {
                if (this.tempArray[i] === true) {
                    index = i;
                    break;
                }
            }
            let lastIndex = index + (this.colNum - 1);
            this.tempArray[index] = false;
            this.tempArray[lastIndex + 1] = true;
            this.setState({ visibleArray: this.tempArray });
        }
    };

    handleContent = (content) => {
        this.setState({
            content: content.content,
            labelList: content.labelList,
        });
    };

    componentWillReceiveProps(nextProps) {
        this.handleContent(nextProps);
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.startHandleVisible = true;
    }

    UNSAFE_componentWillMount() {
        this.handleResize(false);
        for (var i = 0; i < this.colNum; ++i) {
            this.tempArray[i] = true;
        }
        this.setState({ visibleArray: this.tempArray });
        this.handleContent(this.props);
    }

    render() {
        const elementList = [];
        for (let i = 0; i < this.state.numElements; ++i) {
            elementList.push(
                <HomeBlock
                    visible={this.state.visibleArray[i]}
                    id={this.sectionName + "-" + i}
                    key={this.sectionName + "-" + i}
                    content={this.state.content[i]}
                    label={this.state.labelList[i]}
                    clickOpenModal={this.props.clickOpenModal}
                />
            );
        }
        return (
            <div>
                <Grid columns={this.state.columnNum}>
                    {elementList}
                </Grid>

                <div className="control-block">
                    <div className="btn-block">
                        <Button
                            icon
                            className="control-btn"
                            onClick={this.handlePrev}
                        >
                            <Icon name="arrow left" />
                        </Button>
                    </div>
                    <div className="btn-block">
                        <Button
                            icon
                            className="control-btn"
                            onClick={this.handleNext}
                        >
                            <Icon name="arrow right" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

class HomeBlock extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { content } = this.props;
        let id, img, native, romaji, english, label;
        if (content) {
            id = "popular-" + content.id;
            img = content.coverImage.large;
            native = content.title.native;
            romaji = content.title.romaji;
            english = content.title.english;
            label = this.props.label;
        } else {
            id = this.props.id;
            img = tempimg;
            native = "Native Name";
            romaji = "Romaji Name";
            english = "English Name";
        }
        return (
            <Grid.Column className={this.props.visible ? "" : "none"}>
                <OneMedia
                    img={img}
                    id={id}
                    native={native}
                    romaji={romaji}
                    english={english}
                    click={this.props.clickOpenModal}
                    location={"home"}
                    label={label}
                />
            </Grid.Column>
        );
    }
}


const PopularLabel = (props) => {
    let text = (props.text ? props.text : 'Popular');
    return (
        <Label as="a" color="red" ribbon className="myRibbon">
            <Icon name="star" />
            {text}
        </Label>
    );
}

export default Home;
