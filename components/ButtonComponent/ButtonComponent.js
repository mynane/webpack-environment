import React, { Component } from 'react';
import {Button, Icon} from 'jgui';
import classNames from 'classnames';
import shouldComponentUpdate from 'component-pure-render';

class ButtonComponent extends Component {
    static propTypes = {
        prefixCls: React.PropTypes.string,
        type: React.PropTypes.oneOf(['init', 'success', 'fail']),
        handleClick: React.PropTypes.func,
        reset: React.PropTypes.func,
        defaultTime: React.PropTypes.number,
    };

    static defaultProps = {
        prefixCls: 'user-btn',
        type: 'init',
        handleClick: function() {},
        reset: function() {},
        defaultTime: 60
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.timer = null;
        this.state = {
            timer: props.defaultTime,
            status: 'init'
        };
    }

    componentWillReceiveProps(nextProps) {
        let {type} = nextProps;
        switch(type) {
            case 'success':
                setStatus(this, 'success');
                startTimeout(this, 2000);
                break;
            case 'fail':
                setStatus(this, 'init');
                break;
        }
    }
    componentWillUnmount() {
        resetTimer(this);
    }
    handleClick() {
        const {handleClick} = this.props;
        const {status} = this.state;
        if(status === 'init' || status === 'again') {
            setStatus(this, 'sending');
            handleClick();
        }
    }
    render() {
        const {timer, status} = this.state;

        const {prefixCls} = this.props;

        let defaultData = ({
            init: {
                text: '获取短信验证码',
                icon: ''
            },
            sending: {
                text: '验证码发送中…',
                icon: 'loading'
            },
            success: {
                text: '验证码发送成功',
                icon: 'checkcircle_black'
            },
            timer: {
                text: `${timer}S后重新获取`,
                icon: ''
            },
            again: {
                text: '重新获取验证码',
                icon: ''
            }
        })[status];

        let btnClass = classNames(prefixCls, {
            [`${prefixCls}-${status}`]: status
        });

        let iconClass = classNames(`${prefixCls}-icon`, {
            [`${prefixCls}-icon-${status}`]: status
        })

        return (
            <Button
                type="default"
                className={btnClass}
                onClick={this.handleClick.bind(this)}>
                <Icon
                    type={defaultData.icon}
                    className={iconClass}/>
                {defaultData.text}
            </Button>
        );
    }
}

function setStatus(context, status = 'init') {
    context.setState({
        status: status
    });
}

function startInterval(context, time = 1000) {
    let timer = context.state.timer;
    context.timer = setInterval(() => {
        context.setState({
            timer: --timer
        });
        if(timer === 0) {
            resetTimer(context);
        }
    }, time);
}

function startTimeout(context, time = 1000) {
    context.timer = setTimeout(() => {
        context.setState({
            status: 'timer'
        });
        startInterval(context);
    }, time);
}

function resetTimer(context) {
    clearInterval(context.timer);
    context.setState({
        timer: context.props.defaultTime,
        status: 'again'
    });
    context.props.reset();
}

export default ButtonComponent;