import React, { Component } from 'react';
import shouldComponentUpdate from 'component-pure-render';

class Learn extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div>
                12312312
            </div>
        );
    }
}

export default Learn;