import React from 'react';
import { Button, Grid, Icon } from "semantic-ui-react";
import angel from '../images/angel.png';
import { OneMedia } from './MediaList';

class HomeSubSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnNum: 5,
            visibleArray: [],
            content: [],
            labelList: [],
            numElements: props.num,
            visibleLeftBtn: false,
            visibleRightBtn: true,
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
            this.fixResponsive();
            let leftVisible = this.tempArray[0] === true ? false : true;
            let rightVisible =
                this.tempArray[this.state.numElements - 1] === true
                    ? false
                    : true;
            this.setState({
                visibleArray: this.tempArray,
                visibleLeftBtn: leftVisible,
                visibleRightBtn: rightVisible,
            });
        }
    };

    // fix responsive issue when resize window and when visible media !== this.colNum.
    fixResponsive = () => {
        let lastIndex = this.state.numElements - 1;
        if (this.tempArray[lastIndex] === true) {
            let length = lastIndex - this.colNum;
            for (let i = lastIndex; i > length; --i) {
                this.tempArray[i] = true;
            }
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
            for (let i = index; i <= lastIndex; ++i) {
                this.tempArray[i] = false;
            }
            lastIndex = index - this.colNum;
            let j = 0;
            for (let i = index - 1; i >= lastIndex; --i) {
                if (i < 0) {
                    // if reached beginning, reveal another side
                    this.tempArray[index + j] = true;
                    ++j;
                } else {
                    this.tempArray[i] = true;
                }
            }
            this.setState({
                visibleArray: this.tempArray,
                visibleLeftBtn: lastIndex <= 0 ? false : true,
                visibleRightBtn: true,
            });
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
            for (let i = index; i <= lastIndex; ++i) {
                this.tempArray[i] = false;
            }
            ++lastIndex;
            for (let i = 0; i < this.colNum; ++i) {
                if (lastIndex === this.state.numElements) {
                    break;
                } else {
                    this.tempArray[lastIndex] = true;
                    ++lastIndex;
                }
            }
            this.setState({
                visibleArray: this.tempArray,
                visibleRightBtn:
                    lastIndex >= this.state.numElements ? false : true,
                visibleLeftBtn: true,
            });
        }
    };

    handleContent = (content) => {
        this.setState({
            content: content.content,
            labelList: content.labelList,
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.handleContent(nextProps);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.startHandleVisible = true;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
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
                    id={this.sectionName + '-' + i}
                    key={this.sectionName + '-' + i}
                    content={this.state.content[i]}
                    label={this.state.labelList[i]}
                    clickOpenModal={this.props.clickOpenModal}
                />
            );
        }
        return (
            <div>
                <Grid columns={this.state.columnNum}>{elementList}</Grid>

                <div className="control-block">
                    <div
                        className={`btn-block ${
                            !this.state.visibleLeftBtn && 'btn-block-hide'
                        }`}
                    >
                        <Button
                            icon
                            className="control-btn"
                            onClick={this.handlePrev}
                        >
                            <Icon name="arrow left" />
                        </Button>
                    </div>
                    <div
                        className={`btn-block ${
                            !this.state.visibleRightBtn && 'btn-block-hide'
                        }`}
                    >
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
    render() {
        const { content } = this.props;
        let id, img, native, romaji, english, label;
        if (content) {
            id = 'popular-' + content.id;
            img = content.coverImage.large;
            native = content.title.native;
            romaji = content.title.romaji;
            english = content.title.english;
            label = this.props.label;
        } else {
            id = null;
            img = angel;
            native = 'Unknown';
            romaji = 'Romaji Name';
            english = 'Anime Not Found';
        }
        return (
            <Grid.Column className={this.props.visible ? '' : 'none'}>
                <OneMedia
                    img={img}
                    id={id}
                    native={native}
                    romaji={romaji}
                    english={english}
                    click={this.props.clickOpenModal}
                    location={'home'}
                    label={label}
                />
            </Grid.Column>
        );
    }
}

export default HomeSubSection;