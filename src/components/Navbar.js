import React from "react";
import { Menu, Segment, Input, Image, Icon, Sidebar } from "semantic-ui-react";
import style from './Navbar.module.scss';
import logo from '../images/angel.png';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            openSidebar: false,
        };
    }

    handleItemClick = (e, { name }) => this.setState({ active: name });

    handleSidebarHide = () => this.setState({ openSidebar: false });

    handleToggle = () => this.setState({ openSidebar: true });

    handleSearch = (e) => {
        if (e.keyCode === 13) {
            console.log("search for " + e.target.value);
            if (e.target.value !== "") {
                window.location.href = "/search/" + e.target.value;
            }
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
                            icon="search"
                            placeholder="Search..."
                            className={style.sidebarSearch}
                            onKeyUp={this.handleSearch}
                        />
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/"
                        target="_self"
                        active={this.state.active === "home"}
                    >
                        <Icon name="home" />
                        Home
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/anime"
                        target="_self"
                        active={this.state.active === "anime"}
                    >
                        <Icon name="film" />
                        Anime
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="/manga"
                        target="_self"
                        active={this.state.active === "manga"}
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
                                />
                                <Menu.Item
                                    name="anime"
                                    as="a"
                                    href="/anime/"
                                    target="_self"
                                    active={this.state.active === "anime"}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name="manga"
                                    as="a"
                                    href="/manga/"
                                    target="_self"
                                    active={this.state.active === "manga"}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item className={style.search}>
                                    <Input
                                        loading={false}
                                        // icon={<Icon name='search' inverted circular link />}
                                        action={{ icon: "search" }}
                                        placeholder="Search..."
                                        onKeyUp={this.handleSearch}
                                    />
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu>
                    </Segment>
                    <div className={style.bodyContent}>
                        {this.props.children}
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default Navbar;