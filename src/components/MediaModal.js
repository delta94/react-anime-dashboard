import React from "react";
import AnimeQuery from "./AnimeQuery";
import paragraph from "../images/paragraph.png";
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
    Grid
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
            var description = media.description.split('<br><br>');

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
                            <div className={style.modalNative}>
                                {media.title.native}
                            </div>
                            <div className={style.modalRomaji}>
                                ({media.title.romaji})
                            </div>
                            <div className={style.modalEnglish}>
                                {media.title.english}
                            </div>
                            <Header>{this.state.id}</Header>
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
                                </Grid.Column>
                                <Grid.Column width={9}>
                                    <div className={style.description}>
                                        <p>
                                            <b>Description:</b>
                                        </p>
                                        <p>{description[0]}</p>
                                        <p>{description[1]}</p>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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

export default MediaModal;