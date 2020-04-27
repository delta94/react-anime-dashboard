import React from "react";
import { Menu, Segment, Input, Image, Icon, Sidebar, Button } from "semantic-ui-react";
import style from './Navbar.module.scss';
import logo from '../images/angel.png';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            openSidebar: false,
            searchId: ""
        };
    }

    handleSidebarHide = () => this.setState({ openSidebar: false });

    handleToggle = () => this.setState({ openSidebar: true });

    handleChange = (e) => {
        this.setState({ searchId: e.target.value });
    }

    handleEnterSearch = (e) => {
        if (e.keyCode === 13) {
            console.log("search for " + e.target.value);
            if (e.target.value !== "") {
                window.location.href = "/search/" + e.target.value;
            }
        }
    }

    handleClickSearch = (e) => {
        console.log("click + " + this.state.searchId);
        if (this.state.searchId !== "") {
            window.location.href = "/search/" + this.state.searchId;
        }
    }

    render() {
        return (
            <Sidebar.Pushable>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    icon="labeled"
                    inverted
                    onHide={this.handleSidebarHide}
                    vertical
                    visible={this.state.openSidebar}
                    className={style.mySidebar}
                >
                    <Menu.Item
                        as="a"
                        href="/"
                        target="_self"
                        header
                        className={style.sidebarHeader}
                    >
                        <Image
                            src={logo}
                            alt="logo"
                            className={style.sidebarLogo}
                        />
                        <div className={style.sidebarTitle}>
                            Anime Dashboard
                        </div>
                    </Menu.Item>
                    <Menu.Item>
                        <Input
                            className={style.sidebarSearch}
                            icon={
                                <Icon
                                    name="search"
                                    link
                                    onClick={this.handleClickSearch}
                                />
                            }
                            placeholder="Search..."
                            onChange={this.handleChange}
                            onKeyUp={this.handleEnterSearch}
                        />
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/"
                        target="_self"
                        active={this.state.active === "home"}
                        className={style.mySideItem}
                    >
                        <Icon name="home" />
                        Home
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/anime"
                        target="_self"
                        active={this.state.active === "anime"}
                        className={style.mySideItem}
                    >
                        <Icon name="film" />
                        Anime
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/manga"
                        target="_self"
                        active={this.state.active === "manga"}
                        className={style.mySideItem}
                    >
                        <Icon name="book" />
                        Manga
                    </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher dimmed={this.state.openSidebar}>
                    <Segment inverted className={style.fixedNav}>
                        <Menu
                            inverted
                            pointing
                            secondary
                            className={style.wholeMenu}
                        >
                            <Menu.Item
                                as="a"
                                href="/"
                                target="_self"
                                header
                                className={style.header}
                            >
                                <Image
                                    size="mini"
                                    src={logo}
                                    alt="logo"
                                    className={style.headerLogo}
                                />
                                Anime Dashboard
                            </Menu.Item>
                            <Menu.Item
                                as="a"
                                className={style.menuLink}
                                onClick={this.handleToggle}
                            >
                                <Icon name="sidebar"></Icon>
                                Menu
                            </Menu.Item>
                            <Menu.Menu
                                position="right"
                                className={style.navMenu}
                            >
                                <Menu.Item
                                    name="home"
                                    as="a"
                                    href="/"
                                    target="_self"
                                    active={this.state.active === "home"}
                                    onClick={this.handleItemClick}
                                    className={style.mySideItem}
                                />
                                <Menu.Item
                                    name="anime"
                                    as="a"
                                    href="/anime/"
                                    target="_self"
                                    active={this.state.active === "anime"}
                                    onClick={this.handleItemClick}
                                    className={style.mySideItem}
                                />
                                <Menu.Item
                                    name="manga"
                                    as="a"
                                    href="/manga/"
                                    target="_self"
                                    active={this.state.active === "manga"}
                                    onClick={this.handleItemClick}
                                    className={style.mySideItem}
                                />
                                <Menu.Item className={style.search}>
                                    <Input
                                        icon={
                                            <Icon
                                                name="search"
                                                link
                                                onClick={this.handleClickSearch}
                                            />
                                        }
                                        placeholder="Search..."
                                        onChange={this.handleChange}
                                        onKeyUp={this.handleEnterSearch}
                                    />
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </Segment>
                    <div className={style.bodyContent}>
                        {this.props.children}
                    </div>
                    <ScrollTopBtn />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}


class ScrollTopBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    componentDidMount() {
        document.addEventListener('scroll', (e) => {
            if (window.pageYOffset > 100) {
                this.setState({ visible: true });
            } else {
                this.setState({ visible: false });
            }
        });
    }

    render() {
        return (
            <div id="scroll-top" className={`${style.topBlock} ${this.state.visible ? style.topBlockVisible : ""}`}>
                <Button
                    circular
                    icon="arrow up"
                    className={style.topBtn}
                    title="go to top"
                    onClick={this.scrollToTop}
                />
            </div>
        );
    }
}

export default Navbar;