import React from "react";
import AnimeQuery from "./AnimeQuery";
import paragraph from "../images/paragraph.png";
import { getName } from 'country-list';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs';

import { Chart } from "react-google-charts";
import {
    Container,
    Button,
    Modal,
    Image,
    Icon,
    Label,
    Loader,
    Segment,
    Dimmer,
    Grid,
    Rating,
    Transition,
    Table,
} from "semantic-ui-react";
import style from "./MediaList.module.scss";

/**
 * A single media box for displaying information for a single media
 */
class MediaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            banner: "",
            media: null,
            error: false,
            readMore: false,
            informationVisible: false,
            statisticVisible: false,
            characterListVisible: false,
            watchListVisible: false,
        };
    }

    handleReadMore = () => {
        this.setState({
            readMore: !this.state.readMore
        });
    }

    toggleInformation = () => {
        this.setState({
            informationVisible: !this.state.informationVisible,
        });
    };

    toggleStatistic = () => {
        this.setState({
            statisticVisible: !this.state.statisticVisible,
        });
    };

    toggleCharacter = () => {
        this.setState({
            characterListVisible: !this.state.characterListVisible,
        });
    };

    toggleWatch = () => {
        this.setState({
            watchListVisible: !this.state.watchListVisible,
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.open) {
            console.log("current id == " + this.props.id);
            console.log("will receive id == " + nextProps.id);
            AnimeQuery.getMediaByID(nextProps.id)
                .then((res) => {
                    this.setState({
                        id: nextProps.id,
                        media: res.data.Media,
                    });
                })
                .catch(err => {
                    console.log('my err: ' + err);
                    this.setState({
                        error: true
                    });
                });
        }

        // reset all states when modal closed
        if (nextProps.reset) {
            this.setState({
                id: null,
                media: null,
                error: false,
                informationVisible: false,
                statisticVisible: false,
                characterListVisible: false,
                watchListVisible: false,
            });
        }
    }

    render() {
        const { media } = this.state;
        if (media) {
            // description
            var description = handleDescription(media.description);
            var firstDescription = '';
            var showReadmore = false;
            if (description.length > 401) {
                showReadmore = true;
                firstDescription = description.substring(0, 400);
            } else
                firstDescription = description;

            // score
            var score = Math.round((media.meanScore / 100) * 10);

            // tag list
            var tags = [];
            var tagNum = (media.tags.length > 12 ? 12 : media.tags.length);
            for (var i = 0; i < tagNum; ++i) {
                let tag = media.tags[i];
                tags.push(
                    <Label as="a" tag key={tag.name} className={style.tag}>
                        {tag.name}
                    </Label>
                );
            }

            // genres
            var color = media.coverImage.color;
            var genres = [];
            media.genres.forEach((genre) => {
                genres.push(
                    <Label
                        as="a"
                        circular
                        color="black"
                        key={genre}
                        className={style.genre}
                        size="big"
                    >
                        {genre}
                    </Label>
                );
            });            

            return (
                <Modal
                    id="modal"
                    open={this.props.open}
                    onClose={this.props.close}
                    closeOnDimmerClick={true}
                    // closeIcon
                >
                    <div className={style.myModal}>
                        {media.bannerImage ? (
                            <div className={style.modalBanner}>
                                <img
                                    src={media.bannerImage}
                                    alt={media.title.english}
                                    className={style.modalBannerImg}
                                ></img>
                            </div>
                        ) : null}

                        <Container className={style.modalContent}>
                            <div className={style.modalTitle}>
                                <div className={style.modalNative}>
                                    {media.title.native}
                                </div>
                                <div className={style.modalRomaji}>
                                    ({media.title.romaji})
                                </div>
                                <div className={style.modalEnglish}>
                                    {media.title.english}
                                </div>
                            </div>

                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column width={7}>
                                        <div className={style.cover}>
                                            <Image
                                                src={media.coverImage.large}
                                                size="medium"
                                                centered
                                                rounded
                                            />
                                        </div>
                                        <div className={style.rating}>
                                            <Rating
                                                maxRating={10}
                                                defaultRating={score}
                                                disabled
                                                icon="star"
                                                size="large"
                                                title={
                                                    "Mean Score: " +
                                                    media.meanScore
                                                }
                                                className={style.ratingSize}
                                            />
                                        </div>

                                        <div className={style.favorite}>
                                            <Label
                                                size="medium"
                                                className={style.favoriteLabel}
                                            >
                                                <Icon
                                                    name="heart"
                                                    color="red"
                                                />
                                                <span
                                                    className={
                                                        style.favoriteText
                                                    }
                                                >
                                                    {media.favourites} Favorites
                                                </span>
                                            </Label>
                                        </div>

                                        <div className={style.favorite}>
                                            <Label
                                                size="medium"
                                                className={style.favoriteLabel}
                                            >
                                                <Icon
                                                    name="star"
                                                    color="yellow"
                                                />
                                                <span
                                                    className={
                                                        style.favoriteText
                                                    }
                                                >
                                                    {media.popularity}{" "}
                                                    Pupularity
                                                </span>
                                            </Label>
                                        </div>

                                        <div className={style.genreContainer}>
                                            {genres}
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={9}>
                                        <div
                                            className={
                                                style.flexColumnContainer
                                            }
                                        >
                                            <div
                                                className={
                                                    style.descriptionContainer
                                                }
                                            >
                                                <p>
                                                    <b>Description:</b>
                                                </p>
                                                <p
                                                    className={
                                                        style.description
                                                    }
                                                >
                                                    {this.state.readMore
                                                        ? description
                                                        : firstDescription}
                                                    {showReadmore ? (
                                                        <a
                                                            onClick={
                                                                this
                                                                    .handleReadMore
                                                            }
                                                            className={
                                                                style.descriptionReadmore
                                                            }
                                                        >
                                                            {this.state.readMore
                                                                ? "Read Less >>>"
                                                                : "... Read More >>>"}
                                                        </a>
                                                    ) : (
                                                        ""
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={style.tagsContainer}
                                            >
                                                {tags}
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <SubSection
                                click={this.toggleInformation}
                                visible={this.state.informationVisible}
                                name="Media Information"
                                color="blue"
                            >
                                <Container>
                                    <InformationTable media={media} />
                                </Container>
                            </SubSection>

                            <SubSection
                                click={this.toggleStatistic}
                                visible={this.state.statisticVisible}
                                name="Media Statistic"
                                color="olive"
                            >
                                <Container>
                                    <MediaStatistic stats={media.stats} />
                                </Container>
                            </SubSection>

                            <SubSection
                                click={this.toggleCharacter}
                                visible={this.state.characterListVisible}
                                name="Character List"
                                color="violet"
                            >
                                <Container>
                                    <CharacterList
                                        id={media.id}
                                        characters={media.characters}
                                    />
                                </Container>
                            </SubSection>

                            <SubSection
                                click={this.toggleWatch}
                                visible={this.state.watchListVisible}
                                name="Watch List"
                                color="teal"
                            >
                                <Container>
                                    <WatchList
                                        watchList={media.streamingEpisodes}
                                    />
                                </Container>
                            </SubSection>
                        </Container>
                    </div>

                    <Modal.Actions>
                        <Button
                            negative
                            circular
                            onClick={this.props.close}
                            icon
                            labelPosition="right"
                        >
                            Close <Icon name="close" />
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
                    <div className={style.myModal + " " + style.tempModal}>
                        <Segment className={style.loadingBox}>
                            <Dimmer active inverted>
                                <Loader inverted size="large" >
                                    Loading
                                </Loader>
                            </Dimmer>

                            <Image
                                src={paragraph}
                                alt="p"
                                className={style.paragraph}
                            />
                        </Segment>
                    </div>
                    <Modal.Actions>
                        <Button
                            negative
                            circular
                            onClick={this.props.close}
                            icon
                            labelPosition="right"
                        >
                            Close <Icon name="close" />
                        </Button>
                    </Modal.Actions>
                </Modal>
            );
        }
    }
}


const SubSection = (props) => {
    return (
        <div className={style.informationContainer}>
            <Button
                onClick={props.click}
                className={style.modalBigBtn}
                color={props.color}
                circular
                icon
                labelPosition="right"
            >
                {props.name}
                {props.visible ? (
                    <Icon name="angle double up" />
                ) : (
                    <Icon name="angle double down" />
                )}
            </Button>
            <Transition
                visible={props.visible}
                animation="slide down"
                duration={500}
                unmountOnHide={true}
            >
                {props.children}
            </Transition>
        </div>
    );
}


const InformationTable = (props) => {
    const { media } = props;
    // origin country
    var origin = (media.countryOfOrigin ? getName(media.countryOfOrigin) : 'Unknown');

    // season
    var season = "";
    if (media.season && media.seasonYear)
        season = media.season + ' ' + media.seasonYear;
    else
        season = (media.season ? media.season : media.seasonYear ? media.seasonYear : 'Unknown');
    
    // start / end date
    var startDate = convertDate(media.startDate.year, media.startDate.month, media.startDate.day);
    var endDate = convertDate(media.endDate.year, media.endDate.month, media.endDate.day);

    // chapter/volume, episode/duration
    var chapter = (media.chapters ? media.chapters : 'Unknown');
    var volume = (media.volumes ? media.volumes : 'Unknown');
    var episode = (media.episodes ? media.episodes : 'Unknown');
    var duration = convertTime(media.duration);
    
    return (
        <Table
            celled
            selectable
            striped
            color="blue"
            className={style.modalTable}
            unstackable
        >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">Information</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <b>Native Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.native ? media.title.native : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Romaji Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.romaji ? media.title.romaji : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>English Name</b>
                    </Table.Cell>
                    <Table.Cell>
                        {media.title.english ? media.title.english : "Unknown"}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Origin</b>
                    </Table.Cell>
                    <Table.Cell>
                        {origin}
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Type</b>
                    </Table.Cell>
                    <Table.Cell>{media.type}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Format</b>
                    </Table.Cell>
                    <Table.Cell>{media.format}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Status</b>
                    </Table.Cell>
                    <Table.Cell>{media.status}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Season</b>
                    </Table.Cell>
                    <Table.Cell>{season}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>Start Date</b>
                    </Table.Cell>
                    <Table.Cell>{startDate}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>End Date</b>
                    </Table.Cell>
                    <Table.Cell>{endDate}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>
                            {media.type === "ANIME" ? "Episodes" : "Chapters"}
                        </b>
                    </Table.Cell>
                    <Table.Cell>{episode || chapter}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>{media.type === "ANIME" ? "duration" : "Volumes"}</b>
                    </Table.Cell>
                    <Table.Cell>{duration || volume}</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}


const load = (
    <Loader active size="large" />
);


const GooglePie = (props) => {
    return (
        <div>
            <div className={style.statTitle}>{props.title}</div>
            <Chart
                width={"100%"}
                height={"55vh"}
                chartType="PieChart"
                loader={load}
                data={props.data}
                options={{
                    // pieSliceText: "label",
                    chartArea: {
                        width: '80%',
                    },
                    legend: {
                        position: "top",
                        textStyle: { fontSize: 12 },
                        alignment: "start",
                        maxLines: props.length,
                    },
                    pieStartAngle: 50,
                    pieHole: 0.5,
                    // is3D: true,
                    colors: props.colors,
                    enableInteractivity: true,
                }}
            />
        </div>
    );
}

const GoogleBar = (props) => {
    return (
        <div>
            <div className={style.statTitle}>{props.title}</div>
            <Chart
                width={"100%"}
                height={"55vh"}
                chartType="ColumnChart"
                loader={load}
                data={props.data}
                options={{
                    chartArea: { width: "80%"},
                    vAxis: {
                        // title: "# of people",
                        format: 'short'
                    },
                    hAxis: {
                        title: 'Scores'
                    },
                    legend: {
                        position: "none",
                    },
                    animation: {
                        duration: 500,
                        startup: true,
                    },
                    dataOpacity: 0.75,
                    bar: { groupWidth: "70%" },
                }}
            />
        </div>
    );
}

const barColors = [
    "color: red",
    "color: rgb(204, 57, 57)",
    "color: rgb(153, 91, 91)",
    "color: rgb(192, 123, 67)",
    "color: rgb(202, 196, 111)",
    "color: rgb(198, 201, 53)",
    "color: rgb(188, 190, 37)",
    "color: rgb(189, 204, 55)",
    "color: rgb(116, 189, 67)",
    "color: rgb(118, 228, 46)",
];


class MediaStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieData: null,
            pieLength: null,
            pieColors: null,
            pie: null,
            barData: null,
            bar: null
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.stats) {
            let scoreList = this.props.stats.scoreDistribution;
            let statusList = this.props.stats.statusDistribution;

            let statusData = [];
            let statusColor = [];
            statusData.push(["Status", "Number of People"]);
            statusList.forEach(status => {
                statusData.push([status.status, status.amount]);
                if (status.status === "CURRENT")
                    statusColor.push("blue");
                else if (status.status === "COMPLETED")
                    statusColor.push("#9cc747");
                else if (status.status === "PLANNING")
                    statusColor.push("purple");
                else if (status.status === "DROPPED")
                    statusColor.push("red");
                else if (status.status === "PAUSED")
                    statusColor.push("orange");
                else // others
                    statusColor.push("gray");
            });

            let scoreData = [];
            scoreData.push([
                "Scores",
                "Number of People",
                { role: 'style' },
                { role: 'annotation' },
            ]);
            let i = 0;
            scoreList.forEach(score => {
                scoreData.push([
                    score.score.toString(),
                    score.amount,
                    barColors[i],
                    score.score.toString(),
                ]);
                ++i;
            });
            
            this.setState({
                pieData: statusData,
                pieLength: statusList.length,
                pieColors: statusColor,
                barData: scoreData,
            });
        }
    }
    
    componentDidMount() {
        if (this.state.pieData && this.state.barData) {
            console.log("length == " + this.state.pieLength);
            this.setState({
                pie: (
                    <GooglePie
                        data={this.state.pieData}
                        length={this.state.pieLength}
                        title="Status Distribution"
                        colors={this.state.pieColors}
                    />
                ),
                bar: <GoogleBar data={this.state.barData} title="Score Distribution" />,
            });
        }
        
    }

    render() {
        return (
            <div className={style.StatContainer}>
                <Grid doubling columns={2} textAlign="center">
                    <Grid.Column>{this.state.pie}</Grid.Column>
                    <Grid.Column>{this.state.bar}</Grid.Column>
                </Grid>
            </div>
        );
    }
}


class CharacterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            content: []
        };
    }

    UNSAFE_componentWillMount() {
        const { characters } = this.props;
        const mycontent = [];
        if (characters) {
            let charList = characters.edges;
            charList.forEach(char => {
                let roleID = char.id;
                let role = char.role;
                let fullName = char.node.name.full;
                let nativeName = char.node.name.native;
                let img = char.node.image.medium;
                mycontent.push(
                    <Grid.Column key={roleID} className={style.myColumn}>
                        <div className={style.charBox}>
                            <div>
                                <Image
                                    id={roleID}
                                    src={img}
                                    className={style.charImg}
                                />
                            </div>
                            <div className={style.charContent}>
                                <div className={style.charNameBlock}>
                                    <div className={style.charName}>
                                        {nativeName}
                                    </div>
                                    <div className={style.charName}>
                                        {fullName}
                                    </div>
                                </div>

                                <div className={style.charRole}>{role}</div>
                            </div>
                        </div>
                    </Grid.Column>
                );
            });

            this.setState({
                content: this.state.content.concat(mycontent)
            });
        }
    }

    render() {
        return (
            <div className={style.characterContainer}>
                <Grid doubling columns={3}>
                    {this.state.content}
                </Grid>
            </div>
        );
    }
}


class WatchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: [],
            empty: null
        };
    }

    UNSAFE_componentWillMount() {
        const { watchList } = this.props;
        const mycontent = [];
        if (watchList.length > 0) {
            watchList.forEach(watch => {
                let title = watch.title;
                let img = watch.thumbnail;
                let url = watch.url;
                mycontent.push(
                    <Grid.Column key={title} className={style.myColumn}>
                        <div className={style.watchBox} title={title}>
                            <a href={url} target="_blank">
                                <Image
                                    src={img}
                                    className={style.watchImg}
                                />
                                <div className={style.watchTitle}>{title}</div>
                            </a>
                        </div>
                    </Grid.Column>
                );
            });

            this.setState({
                content: this.state.content.concat(mycontent)
            });
        }
    }

    render() {
        if (this.props.watchList.length > 0) {
            return (
                <div className={style.characterContainer}>
                    <Grid doubling columns={3}>
                        {this.state.content}
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className={style.characterContainer}>
                    <div className={style.emptyWatchBox}>
                        <div>No watch list</div>
                    </div>
                </div>
            );
        }
    }
}


function handleDescription(mediaDescription) {
    let desList = mediaDescription.split(/<br>(.*|[^.*])<br>/g);
    var description = "";
    for (var i = 0; i < desList.length; ++i) {
        if (desList[i] === "" || desList[i] === "\n")
            continue;
        let sub = desList[i].split("\n");
        for (var j = 0; j < sub.length; ++j) {
            if (sub[j] === "" || sub[j] === "\n")
                continue;
            let subb = sub[j].replace(/\n|\r|\r\n|<br>|<\/br>/gm, "");
            if (subb !== "")
                description += subb + "\n\n";
        }
    }
    return description;
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// convert date into format "Month day, year"
function convertDate(myear, mmonth, mday) {
    var date = '';
    if (myear)
        date = myear.toString();
    if (mday)
        date = mday.toString() + ", " + date;
    if (mmonth && mday)
        date = months[mmonth - 1] + " " + date;
    else if (mmonth)
        date = months[mmonth - 1] + ", " + date;
    if (date === "")
        date = "Unknown";
    return date;
}


function convertTime(time) {
    if (time) {
        if (time < 60)
            return time.toString() + ' mins';
        let hour = (time / 60);
        hour = Math.floor(hour);
        let min = time - (hour * 60);
        let hourText = (hour === 1 ? 'hour' : 'hours');
        let minText = (min === 1 ? 'min' : 'mins');
        return hour.toString() + ' ' + hourText + ' ' + min + ' ' + minText;
    } else {
        return 'Unknown';
    }
}




export default MediaModal;