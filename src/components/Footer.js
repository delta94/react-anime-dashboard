import React from 'react';
import { Link } from 'react-router-dom';
import angel from '../images/angel.png';

class Footer extends React.Component {
    render() {
        return (
            <div className="footer-container">
                <div className="footer-text-block">
                    <Link to="/" target="_self">
                        <img
                            src={angel}
                            alt="angel-logo"
                            className="footer-img"
                        />
                    </Link>
                    <div className="footer-text">
                        Copyright © 2020 Huanxiang Su - All Rights Reserved
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;