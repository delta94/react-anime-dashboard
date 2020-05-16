import React from "react";
import AnimeQuery from "./AnimeQuery";
import MediaModal from './MediaModal';
import { ErrorBox } from './Error';
import { Button, Icon, Dropdown, Label, Grid, Divider, Transition, Sidebar, Menu, Form, Input } from 'semantic-ui-react';
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
                sort: ''
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

    getConfigFromFilter = (config) => {
        if (JSON.stringify(this.config) !== JSON.stringify(config)) {
            this.config = { ...config };
            AnimeQuery.getCustomMedia(50, 1, this.config)
                .then((res) => {
                    this.handleResult(res, true);
                    this.addLoadMore(true, false);
                    this.setState({
                        ResultNum: res.data.Page.pageInfo.total,
                    });
                })
                .catch((err) => this.handleError(err));
        }
    }

    render() {
        return (
            <div>
                {/* {!this.state.error &&
                    <h3 style={{ color: 'white' }}>
                        Total {this.state.ResultNum} results {this.state.searchText}
                    </h3>
                } */}
                <MediaFilterBar
                    sendConfig={this.getConfigFromFilter}
                    initialConfig={this.config}
                    initialType={this.props.type}
                    searchKey={this.props.searchKey}
                />
                <Divider />
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
        const { id, img, native, romaji, english, click, location, label } = this.props;
        var alt = english ? english : romaji ? romaji : native;
        var firstTitle = native ? native : romaji;
        var secondTitle = english ? english : native ? romaji : '';
        var locStyle = location
            ? location === 'home'
                ? 'home-anime-block'
                : 'anime-block'
            : 'anime-block';
        var mylabel = label ? label : null;

        return (
            <div key={id} className={locStyle}>
                <div className="anime-img-block">
                    {/* <img id={id} src={img} alt={alt} onClick={click}></img> */}
                    <LazyLoadImage
                        id={id}
                        src={img}
                        alt={alt}
                        onClick={click}
                        className={'anime-img'}
                        threshold={100}
                        effect="myblur"
                        tabIndex="0"
                    />
                </div>
                <div className="anime-title">{firstTitle}</div>
                <div className="anime-title">{secondTitle}</div>
                {mylabel}
            </div>
        );
    }
}


const typeOptions = [
    { key: 'typeAny', text: 'Any', value: '' },
    { key: 'animeOption', text: 'ANIME', value: 'anime' },
    { key: 'mangaOption', text: 'MANGA', value: 'manga' },
];

const seasonOptions = [
    { key: 'seasonAny', text: 'Any', value: '' },
    { key: 'springOption', text: 'Spring', value: 'Spring' },
    { key: 'summerOption', text: 'Summer', value: 'Summer' },
    { key: 'fallOption', text: 'Fall', value: 'Fall' },
    { key: 'winterOption', text: 'Winter', value: 'Winter' },
];

const sortOptions = [
    { key: 'sortAny', text: 'Default', value: '' },
    { key: 'popularOption', text: 'Popularity', value: 'popularity_desc' },
    { key: 'latestOption', text: 'Latest', value: 'latest' },
];

const seasonYearOptions = getSeasonYearList();

class MediaFilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            tagList: [],
            filterSearch: '',
            filterType: '',
            filterSeason: '',
            filterSeasonYear: '',
            filterSort: '',
        };
        this.searchKey = this.props.searchKey;
        this.initialTypeDisabled = false;
        this.initialSearchDisabled = false;
        this.config = { ...props.initialConfig };
        this.filterSearch = '';
        this.filterType = '';
        this.filterSeason = '';
        this.filterSeasonYear = '';
        this.filterSort = '';
    }

    handleInitial = () => {
        let initialType = this.props.initialType;
        if (initialType) {
            if (initialType === 'anime' || initialType === 'manga') {
                this.initialTypeDisabled = true;
            } else if (initialType === 'search') {
                this.initialSearchDisabled = true;
            }
        }
        let config = this.props.initialConfig;
        if (config.type) this.filterType = config.type;
        if (config.season) this.filterSeason = config.season;
        if (config.seasonYear) this.filterSeasonYear = config.seasonYear;
        if (config.sort) this.filterSort = config.sort;
        if (config.search) this.filterSearch = config.search;

        this.setState({
            filterSearch: this.filterSearch,
            filterType: this.filterType,
            filterSeason: this.filterSeason,
            filterSeasonYear: this.filterSeasonYear,
            filterSort: this.filterSort,
        });
    }

    UNSAFE_componentWillMount = () => {
        this.handleInitial();
        this.updateFilterTags();
    };

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.searchKey !== nextProps.searchKey) {
            this.searchKey = nextProps.searchKey;
            this.resetFilter();
            this.filterSearch = this.searchKey;
            this.setState({ filterSearch: this.filterSearch });
            this.updateFilterTags();
        }
    };

    handleOpen = () => {
        this.setState({ visible: true });
    };

    handleClose = () => {
        this.setState({ visible: false });
    };

    handleType = (event, data) => {
        this.filterType = data.value;
        this.setState({ [data.id]: data.value });
    };
    handleSeason = (e, data) => {
        this.filterSeason = data.value;
        this.setState({ [data.id]: data.value });
    };
    handleSeasonYear = (e, data) => {
        this.filterSeasonYear = data.value;
        this.setState({ [data.id]: data.value });
    };
    handleSort = (e, data) => {
        this.filterSort = data.value;
        this.setState({ [data.id]: data.value });
    };
    handleSearch = (e) => {
        this.filterSearch = e.target.value;
        this.setState({ filterSearch: e.target.value });
    }

    applyFilter = () => {
        this.config.type = this.filterType;
        this.config.season = this.filterSeason;
        this.config.seasonYear = this.filterSeasonYear;
        this.config.sort = this.filterSort;
        this.config.search = this.filterSearch;
        this.props.sendConfig(this.config);
        this.updateFilterTags();
        this.handleClose();
    };

    keyupFilter = (e) => {
        if (e.keyCode === 13) {
            this.applyFilter();
        }
    };

    resetFilter = () => {
        if (!this.initialTypeDisabled) {
            this.filterType = '';
        }
        if (!this.initialSearchDisabled) {
            this.filterSearch = '';
        }
        this.filterSeason = '';
        this.filterSeasonYear = '';
        this.filterSort = '';
        this.setState({
            filterSearch: this.filterSearch,
            filterType: this.filterType,
            filterSeason: this.filterSeason,
            filterSeasonYear: this.filterSeasonYear,
            filterSort: this.filterSort,
        });
    };

    updateFilterTags = () => {
        const tagList = [];
        if (this.filterSearch && this.filterSearch !== '') {
            tagList.push(this.addTag('searchTag', this.filterSearch));
        }
        if (this.filterType && this.filterType !== '') {
            tagList.push(this.addTag('typeTag', this.filterType));
        }
        if (this.filterSeason && this.filterSeason !== '') {
            tagList.push(this.addTag('seasonTag', this.filterSeason));
        }
        if (this.filterSeasonYear && this.filterSeasonYear !== '') {
            tagList.push(this.addTag('seasonYearTag', this.filterSeasonYear));
        }
        if (this.filterSort && this.filterSort !== '') {
            tagList.push(this.addTag('sortTag', this.filterSort));
        }

        this.setState({ tagList: tagList });
    };

    handleCloseTag = (e) => {
        let id = e.target.parentNode.id;
        if (id && id !== '') {
            if (id === 'typeTag') {
                if (!this.initialTypeDisabled) {
                    this.filterType = '';
                    this.setState({ filterType: '' });
                }
            } else if (id === 'seasonTag') {
                this.filterSeason = '';
                this.setState({ filterSeason: '' });
            } else if (id === 'seasonYearTag') {
                this.filterSeasonYear = '';
                this.setState({ filterSeasonYear: '' });
            } else if (id === 'sortTag') {
                this.filterSort = '';
                this.setState({ filterSort: '' });
            } else if (id === 'searchTag') {
                if (!this.initialSearchDisabled) {
                    this.filterSearch = '';
                    this.setState({ filterSearch: '' });
                }
            }
            this.applyFilter();
        }
    }

    addTag = (id, text) => {
        return (
            <Label
                size="medium"
                as="a"
                className={style.filterTag}
                id={id}
                key={id}
                circular
            >
                <Icon name="tags" />
                <span>{text}</span>
                <Icon
                    name="close"
                    className={style.filterTagIcon}
                    onClick={this.handleCloseTag}
                />
            </Label>
        );
    };

    render() {
        const { visible } = this.state;
        return (
            <div className={style.filterContainer}>
                <Grid container columns={2}>
                    <Grid.Row>
                        <Grid.Column computer={10} verticalAlign="middle">
                            {this.state.tagList}
                        </Grid.Column>
                        <Grid.Column
                            computer={6}
                            verticalAlign="middle"
                            textAlign="right"
                        >
                            <div className={style.filterBtnBlock}>
                                <Button
                                    size="medium"
                                    icon
                                    labelPosition="left"
                                    className={style.filterBtn}
                                    active={visible}
                                    onClick={this.handleOpen}
                                >
                                    <Icon name="filter" />
                                    Filter
                                </Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <div
                    className={
                        visible
                            ? `${style.wrapper} ${style.wrapperShow}`
                            : `${style.wrapper}`
                    }
                >
                    <div className={style.sidebarLid}></div>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        direction="right"
                        icon="labeled"
                        vertical
                        onHide={this.handleClose}
                        visible={visible}
                        className={style.filterSidebar}
                    >
                        <Menu.Item header as="h2">
                            Filter
                        </Menu.Item>
                        <Form
                            // onSubmit={this.applyFilter}
                            onKeyUp={this.keyupFilter}
                        >
                            <div className={style.filterSection}>
                                <Menu.Item className={style.filterItem}>
                                    <Form.Field>
                                        <label htmlFor='filterSearch'>Search:</label>
                                        <Input
                                            id="filterSearch"
                                            label={{ icon: 'asterisk' }}
                                            labelPosition="right corner"
                                            placeholder="Search By Title ..."
                                            disabled={this.initialSearchDisabled}
                                            onChange={this.handleSearch}
                                            value={this.state.filterSearch}
                                        />
                                    </Form.Field>
                                </Menu.Item>
                                <Menu.Item className={style.filterItem}>
                                    <Form.Field>
                                        <Form.Select
                                            id="filterType"
                                            placeholder="Type: Any"
                                            clearable
                                            label={'Media Type:'}
                                            options={typeOptions}
                                            selectOnBlur={false}
                                            value={this.state.filterType}
                                            disabled={this.initialTypeDisabled}
                                            selection
                                            fluid
                                            onChange={this.handleType}
                                            className={style.dropdownBtn}
                                        />
                                    </Form.Field>
                                </Menu.Item>
                                <Menu.Item className={style.filterItem}>
                                    <Form.Field>
                                        <label>Season:</label>
                                        <Dropdown
                                            id="filterSeason"
                                            placeholder="Season: Any"
                                            clearable
                                            options={seasonOptions}
                                            value={this.state.filterSeason}
                                            selection
                                            selectOnBlur={false}
                                            fluid
                                            onChange={this.handleSeason}
                                            className={style.dropdownBtn}
                                        />
                                    </Form.Field>
                                </Menu.Item>
                                <Menu.Item className={style.filterItem}>
                                    <Form.Field>
                                        <label htmlFor={'filterSeasonYear'}>
                                            Season Year:
                                        </label>
                                        <Dropdown
                                            id="filterSeasonYear"
                                            placeholder="Season Year: Any"
                                            clearable
                                            search
                                            options={seasonYearOptions}
                                            value={this.state.filterSeasonYear}
                                            selectOnBlur={false}
                                            onChange={this.handleSeasonYear}
                                            selection
                                            fluid
                                            className={style.dropdownBtn}
                                        />
                                    </Form.Field>
                                </Menu.Item>

                                <Menu.Item className={style.filterItem}>
                                    <Form.Field>
                                        <label>Sort By:</label>
                                        <Dropdown
                                            id="filterSort"
                                            placeholder="Sort: Default"
                                            clearable
                                            options={sortOptions}
                                            value={this.state.filterSort}
                                            selectOnBlur={false}
                                            onChange={this.handleSort}
                                            selection
                                            fluid
                                            className={style.dropdownBtn}
                                        />
                                    </Form.Field>
                                </Menu.Item>
                            </div>
                            <Menu.Item className={style.filterItem}>
                                <Button
                                    type="submit"
                                    primary
                                    fluid
                                    onClick={this.applyFilter}
                                    className={style.applyBtn}
                                >
                                    Apply
                                </Button>
                            </Menu.Item>
                            <Menu.Item className={style.filterItem}>
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <Button
                                            color="red"
                                            fluid
                                            icon
                                            labelPosition="right"
                                            onClick={this.handleClose}
                                            className={`${style.applyBtn} ${style.left}`}
                                        >
                                            <Icon name="close" />
                                            Close
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Button
                                            color="red"
                                            fluid
                                            icon
                                            labelPosition="right"
                                            onClick={this.resetFilter}
                                            className={`${style.applyBtn} ${style.left}`}
                                        >
                                            <Icon name="redo" />
                                            Reset
                                        </Button>
                                    </Grid.Column>
                                </Grid>
                            </Menu.Item>
                        </Form>
                    </Sidebar>
                </div>
            </div>
        );
    }
}

function getSeasonYearList() {
    let thisYear = new Date().getFullYear();
    const seasonYears = [];
    seasonYears.push({
        key: 'seasonYearOptionAny',
        text: 'Any',
        value: '',
    });
    for (let i = thisYear + 2; i >= 1970; --i) {
        seasonYears.push({
            key: 'seasonYearOption' + i,
            text: i.toString(),
            value: i.toString(),
        });
    }
    return seasonYears;
}

export default MediaList;
export { OneMedia };