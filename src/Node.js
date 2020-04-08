import React from 'react';


var url = 'http://localhost:8080/test/hello',
    options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeRes: ""
        };
    }

    callNode() {
        fetch(url).then(res => res.text())
            .then(res => this.setState({ nodeRes: res }));
    }

    componentWillMount() {
        this.callNode();
    }


    render() {
        return (
            <h1>{this.state.nodeRes}</h1>
        )
    }
}

export default Node;