import React from "react";
import AnimeQuery from "./AnimeQuery";
import paragraph from "../images/paragraph.png";
import {
    Container,
    Button,
    Modal,
    Image,
    Icon,
    Label,
    Card,
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
            informationVisible: false,
            statisticVisible: false,
            characterListVisible: false,
            watchListVisible: false,
        };
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
            let desList = media.description.split(/<br>*<br>/g);
            const description = [];
            for (var i = 0; i < desList.length; ++i) {
                description.push(<p key={"description" + i}>{desList[i]}</p>);
            }

            // score
            var score = Math.round((media.meanScore / 100) * 10);

            // tag list
            var tags = [];
            media.tags.forEach((tag) => {
                tags.push(
                    <Label as="a" tag key={tag.name} className={style.tag}>
                        {tag.name}
                    </Label>
                );
            });

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
                                            <Label size="medium" className={style.favoriteLabel}>
                                                <Icon
                                                    name="heart"
                                                    color="red"
                                                />
                                                <span className={style.favoriteText}>
                                                    {media.favourites} Favorites
                                                </span>
                                            </Label>
                                        </div>

                                        <div className={style.favorite}>
                                            <Label size="medium" className={style.favoriteLabel}>
                                                <Icon
                                                    name="star"
                                                    color="yellow"
                                                />
                                                <span className={style.favoriteText}>
                                                    {media.popularity} Pupularity
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
                                            <div className={style.description}>
                                                <p>
                                                    <b>Description:</b>
                                                </p>
                                                {description}
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
                                    <InformationTable media={media} />
                                </Container>
                                
                            </SubSection>

                            <SubSection
                                click={this.toggleCharacter}
                                visible={this.state.characterListVisible}
                                name="Character List"
                                color="violet"
                            >
                                <Container>
                                    <CharacterList />
                                </Container>
                            </SubSection>

                            <SubSection
                                click={this.toggleWatch}
                                visible={this.state.watchListVisible}
                                name="Watch List"
                                color="teal"
                            >
                                <Image size="large" src={paragraph} />
                            </SubSection>
                        </Container>
                    </div>

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
                        {this.state.error ? 
                            <h1>Error! Please try again later!</h1>
                            :
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
                        }
                        
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
                        <b>{media.type === 'ANIME' ? 'Episodes' : 'Chapters'}</b>
                    </Table.Cell>
                    <Table.Cell>{episode || chapter}</Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell>
                        <b>{media.type === 'ANIME' ? 'duration' : 'Volumes'}</b>
                    </Table.Cell>
                    <Table.Cell>{duration || volume}</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
}


class CharacterList extends React.Component {
    constructor(props) {
        super(props);
    }


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