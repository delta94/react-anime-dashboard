import React from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import { Button, Form, Input, Card, Placeholder, Container, Label, Divider, Grid } from "semantic-ui-react";
import Navbar from './components/Navbar';

import AnimeQuery from "./components/AnimeQuery";

import tempimg from './images/page-not-found.png';

import { OneMedia } from './components/MediaList';
import MediaModal from './components/MediaModal';

var colNum = 5;
var tempArray = [false, false, false, false, false, false, false, false, false, false];

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnNum: null,
            visibleArray: [false, false, false, false, false, false, false, false, false, false],
            content: []
        };
    }

    handleResize = () => {
        if (window.innerWidth >= 1200) {
            if (this.state.columnNum !== 5) {
                colNum = 5;
                this.handleResizeVisible(this.state.columnNum, colNum);
                this.setState({ columnNum: 5 });
            }
        } else if (window.innerWidth >= 992) {
            if (this.state.columnNum !== 4) {
                colNum = 4;
                this.handleResizeVisible(this.state.columnNum, colNum);
                this.setState({ columnNum: 4 });
            }
        } else if (window.innerWidth >= 640) {
            if (this.state.columnNum !== 3) {     
                colNum = 3;
                this.handleResizeVisible(this.state.columnNum, colNum);
                this.setState({ columnNum: 3 });
            }
        } else {
            if (this.state.columnNum !== 2) {
                colNum = 2;
                this.handleResizeVisible(this.state.columnNum, colNum);
                this.setState({ columnNum: 2 });
            }     
        }
        // console.log("resize == " + colNum);
    }


    handleResizeVisible = (currentCol, nextCol) => {
        if (currentCol) {
            let index = 0;
            for (let i = 0; i < 10; ++i) {
                if (tempArray[i] === true) {
                    index = i;
                    break;
                }
            }
            let lastIndex = index + (currentCol - 1);
            // console.log('current = ' + currentCol + '  next = ' + nextCol);
            if (currentCol > nextCol) {
                // shrink list
                tempArray[lastIndex] = false;
            } else {
                // expand list
                if (lastIndex === 9) {
                    tempArray[index - 1] = true;
                } else {
                    tempArray[lastIndex + 1] = true;
                }
            }
            this.setState({ visibleArray: tempArray });
        }
    }


    handleExplore = () => {
        $("html, body").animate({ scrollTop: $('#home-main').offset().top - 117 }, 600);
    }


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        console.log("did mount ..");
    }

    componentWillUpdate() {
        console.log("state updated before render: componentWillUpdate ");
    }

    UNSAFE_componentWillMount() {
        this.handleResize();
        tempArray = this.state.visibleArray;
        console.log(this.state.columnNum);
        for (var i = 0; i < colNum; ++i) {
            tempArray[i] = true;
        }
        this.setState({ visibleArray: tempArray });
    }

    render() {
        return (
            <Navbar active="home">
                <div className="home-img">
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
                    <h3 className="block-title">Popular</h3>
                    <Divider />
                    <Grid columns={this.state.columnNum}>
                        <HomeBlock visible={this.state.visibleArray[0]} id={'popular-0'} />
                        <HomeBlock visible={this.state.visibleArray[1]} id={'popular-1'} />
                        <HomeBlock visible={this.state.visibleArray[2]} id={'popular-2'} />
                        <HomeBlock visible={this.state.visibleArray[3]} id={'popular-3'} />
                        <HomeBlock visible={this.state.visibleArray[4]} id={'popular-4'} />
                        <HomeBlock visible={this.state.visibleArray[5]} id={'popular-5'} />
                        <HomeBlock visible={this.state.visibleArray[6]} id={'popular-6'} />
                        <HomeBlock visible={this.state.visibleArray[7]} id={'popular-7'} />
                        <HomeBlock visible={this.state.visibleArray[8]} id={'popular-8'} />
                        <HomeBlock visible={this.state.visibleArray[9]} id={'popular-9'} />
                    </Grid>

                    <div style={{ height: "100vh" }}></div>
                </Container>
            </Navbar>
        );
    }
}

class HomeBlock extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Grid.Column id={this.props.id} className={this.props.visible ? '' : 'none'}>
                <OneMedia img={tempimg} id={null} native={this.props.id} english={'English Title'} click={null} location={'home'} />
            </Grid.Column>
        );
    }
}

export default Home;
