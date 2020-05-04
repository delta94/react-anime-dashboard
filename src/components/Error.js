import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "./Navbar";
import angel from '../images/angel.png';
import style from './Error.module.css';

const Error = () => {
    let location = useLocation();
    return (
        <Navbar active="error">
            <ErrorBox
                title={"404 NOT FOUND"}
                text={"No match for " + location.pathname}
            />
        </Navbar>
    );
}

const ErrorBox = (props) => {
    let errorTitle = (props.title ? props.title : 'ERROR!');
    let errorText = (props.text ? props.text : 'Something Wrong');
    return (
        <div className={style.errorContainer}>
            <div className={style.errorBox}>
                <div className={style.textBlock}>
                    <h1>{errorTitle}</h1>
                    <h4>
                        {errorText}
                    </h4>
                </div>
            </div>
            <img src={angel} className={style.img}></img>
        </div>
    );
}

export default Error;
export { ErrorBox };