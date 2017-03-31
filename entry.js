import 'babel-polyfill'
import 'intl';
import 'intl/locale-data/jsonp/en.js';
import React from 'react'
import ReactDOM from 'react-dom'
import Index from './App';

ReactDOM.render(
    <Index/>,
    document.getElementById('container')
)