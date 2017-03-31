import React, { Component } from 'react';

// 自定义组件和文件

class Wrap extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default Wrap;