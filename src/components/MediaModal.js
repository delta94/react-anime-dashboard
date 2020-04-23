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
    Transition
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
            AnimeQuery.getMediaByID(nextProps.id).then((res) => {
                this.setState({
                    id: nextProps.id,
                    media: res.data.Media,
                });
            });
        }

        // reset all states when modal closed
        if (nextProps.reset) {
            this.setState({
                id: null,
                media: null,
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
                                <Image size="large" src={paragraph} />
                            </SubSection>

                            <SubSection
                                click={this.toggleStatistic}
                                visible={this.state.statisticVisible}
                                name="Media Statistic"
                                color="olive"
                            >
                                <Image size="large" src={paragraph} />
                            </SubSection>

                            <SubSection
                                click={this.toggleCharacter}
                                visible={this.state.characterListVisible}
                                name="Character List"
                                color="violet"
                            >
                                <Image size="large" src={paragraph} />
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

export default MediaModal;