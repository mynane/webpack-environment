import React, { Component } from 'react';
import {is} from 'immutable';
import shouldComponentUpdate from 'component-pure-render';
import "jgfe-common/style/index";

// 自定义组件和文件
import Learn from '../../components/learn';
import ButtonComponent from '../../components/ButtonComponent/index';

class Register extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.state = {
            type: 'init'
        };
    }

    handleClick(text) {
        setTimeout(() => {
            this.setState({
                type: 'success'
            });
        }, 2000);
    }

    reset() {
        this.setState({
            type: 'init'
        });
    }

    render() {
        return (
            <div style={{"margin": "100px auto", "textAlign": "center"}}>
                <ButtonComponent
                    type={this.state.type}
                    defaultTime={12}
                    handleClick={this.handleClick.bind(this)}
                    reset={this.reset.bind(this)}/>
            </div>
        );
    }
}

export default Register;