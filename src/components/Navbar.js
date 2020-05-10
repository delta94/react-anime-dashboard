import React from "react";
import { Menu, Segment, Input, Image, Icon, Sidebar, Button } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import style from './Navbar.module.scss';
import logo from '../images/angel.png';
import $ from 'jquery';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            openSidebar: false,
            searchId: "",
            reachScrollHeight: false,
        };
    }

    handleSidebarHide = () => this.setState({ openSidebar: false });

    handleToggle = () => this.setState({ openSidebar: true });

    handleChange = (e) => {
        this.setState({ searchId: e.target.value });
    }

    handleEnterSearch = (e) => {
        if (e.keyCode === 13) {
            if (e.target.value !== "") {
                // window.location.href = "/search/" + e.target.value;
                this.props.history.push({
                    pathname: '/search/' + e.target.value,
                });
            }
        }
    }

    handleClickSearch = () => {
        if (this.state.searchId !== "") {
            this.props.history.push({
                pathname: '/search/' + this.state.searchId,
            });
        }
    }

    handleNavbarScroll = () => {
        if (window.pageYOffset > window.innerHeight - 80) {
            this.setState({ reachScrollHeight: true });
        } else {
            this.setState({ reachScrollHeight: false });
        }
    }

    UNSAFE_componentWillMount() {
        this.handleNavbarScroll();
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handleNavbarScroll);
    }

    componentDidMount() {
        if (this.state.active === 'home') {
            document.addEventListener("scroll", this.handleNavbarScroll);
        }
    }

    render() {
        return (
            <Sidebar.Pushable>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    direction="right"
                    icon="labeled"
                    inverted
                    onHide={this.handleSidebarHide}
                    vertical
                    visible={this.state.openSidebar}
                    className={style.mySidebar}
                >
                    <Link
                        to="/"
                        target="_self"
                        className={'header item ' + style.sidebarHeader}
                    >
                        <Image
                            src={logo}
                            alt="logo"
                            className={style.sidebarLogo}
                        />
                        <div className={style.sidebarTitle}>
                            Anime Dashboard
                        </div>
                    </Link>
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
                    <Link
                        to="/"
                        target="_self"
                        className={
                            this.state.active === 'home'
                                ? 'active item ' + style.mySideItem
                                : 'item ' + style.mySideItem
                        }
                    >
                        <Icon name="home" />
                        Home
                    </Link>
                    <Link
                        to="/anime"
                        target="_self"
                        className={
                            this.state.active === 'anime'
                                ? 'active item ' + style.mySideItem
                                : 'item ' + style.mySideItem
                        }
                    >
                        <Icon name="film" />
                        Anime
                    </Link>
                    <Link
                        to="/manga"
                        target="_self"
                        className={
                            this.state.active === 'manga'
                                ? 'active item ' + style.mySideItem
                                : 'item ' + style.mySideItem
                        }
                    >
                        <Icon name="book" />
                        Manga
                    </Link>
                </Sidebar>

                <Sidebar.Pusher dimmed={this.state.openSidebar}>
                    <Segment
                        id="outer-nav"
                        inverted
                        className={
                            this.state.active === 'home' ||
                            this.state.active === 'error'
                                ? this.state.reachScrollHeight
                                    ? style.fixedNav + ' ' + style.bottomMenu
                                    : style.fixedNav + ' ' + style.transparent
                                : style.fixedNav
                        }
                    >
                        <Menu
                            id="inner-nav"
                            inverted
                            pointing
                            secondary
                            className={
                                this.state.active === 'home' ||
                                this.state.active === 'error'
                                    ? this.state.reachScrollHeight
                                        ? style.wholeMenu +
                                          ' ' +
                                          style.bottomMenu
                                        : style.wholeMenu + ' ' + style.topMenu
                                    : style.wholeMenu
                            }
                        >
                            {/* <Menu.Item
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
                            </Menu.Item> */}
                            <Link
                                to="/"
                                target="_self"
                                className={'header item ' + style.header}
                            >
                                <Image
                                    src={logo}
                                    alt="logo"
                                    size="mini"
                                    className={style.headerLogo}
                                />
                                    Anime Dashboard
                            </Link>
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
                                <Link
                                    to="/"
                                    target="_self"
                                    className={
                                        this.state.active === 'home'
                                            ? 'active item ' + style.mySideItem
                                            : 'item ' + style.mySideItem
                                    }
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/anime"
                                    target="_self"
                                    className={
                                        this.state.active === 'anime'
                                            ? 'active item ' + style.mySideItem
                                            : 'item ' + style.mySideItem
                                    }
                                >
                                    Anime
                                </Link>
                                <Link
                                    to="/manga"
                                    target="_self"
                                    className={
                                        this.state.active === 'manga'
                                            ? 'active item ' + style.mySideItem
                                            : 'item ' + style.mySideItem
                                    }
                                >
                                    Manga
                                </Link>
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
                                        className={style.searchInput}
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
    constructor() {
        super();
        this.state = {visible: false};
    }

    scrollToTop = () => {
        // window.scrollTo({
        //     top: 0,
        //     behavior: "smooth"
        // });
        $('html, body').animate({scrollTop: 0}, 1000);
    }

    detectScroll = () => {
        if (window.pageYOffset > 100) {
            this.setState({ visible: true });
        } else {
            this.setState({ visible: false });
        }
    }

    componentDidMount() {
        document.addEventListener('scroll', this.detectScroll);
        this.detectScroll();
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.detectScroll);
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