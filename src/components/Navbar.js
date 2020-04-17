import React from "react";
import { Menu, Segment, Input, Image, Icon, Sidebar } from "semantic-ui-react";
import style from './navbar.module.scss';
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

    render() {
        return (
            <Sidebar.Pushable className={style.push}>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    icon="labeled"
                    inverted
                    onHide={this.handleSidebarHide}
                    vertical
                    visible={this.state.openSidebar}
                    width="thin"
                >
                    <Menu.Item as="a">
                        <Icon name="home" />
                        Home
                    </Menu.Item>
                    <Menu.Item as="a">
                        <Icon name="gamepad" />
                        Games
                    </Menu.Item>
                    <Menu.Item as="a">
                        <Icon name="camera" />
                        Channels
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
                                        icon="search"
                                        placeholder="Search..."
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