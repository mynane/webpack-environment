require('es6-promise').polyfill();
require('core-js/fn/object/assign');

import 'fetch-detector';
import 'fetch-ie8';
import React, {PropTypes, Component} from 'react';
import {Provider} from 'react-redux';
import {Router, hashHistory, Route, IndexRoute, IndexRedirect} from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers';
import {syncHistoryWithStore} from 'react-router-redux';
import {LocaleProvider} from 'jgui';
const history = hashHistory; //syncHistoryWithStore(hashHistory, store);

import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';

import zh_CN from 'jgfe-common/locale/zh_CN';
import zh_TW from 'jgfe-common/locale/zh_TW';
import en from 'jgfe-common/locale/en';
import jgui_zhTW from 'jgui/lib/locale-provider/zh_TW';

import {Wrap} from './views';

import {
    IntlProvider,
    addLocaleData,
} from 'react-intl';
addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);
addLocaleData([
    { locale: 'zh_CN', parentLocale: 'zh-Hans'},
    { locale: 'zh_TW', parentLocale: 'zh-Hant'}
]);

import NotFound from "jgfe-common/views/NotFound";

import ViewPage from './constants/ViewPage';

const locales = {
    'zh_CN': zh_CN,
    'zh_TW': zh_TW,
    'en': en,
};

let store = createStore(combineReducers(reducers), applyMiddleware(thunkMiddleware));

function routes(store) {
    const childRoutes = ViewPage.map(
        (router, key) => <Route key={key} path={router.name} component={router.component}/>
    );
    return (
        <Route path="/" component={Wrap}>
            <IndexRedirect to="/register"/>
            { childRoutes }
            <Route path='*' component={NotFound}></Route>
        </Route>
    );
}

let locale = getLocaleLang();
locale = _.keys(locales).indexOf(locale) >= 0 ? locale : 'zh_CN';
// store.dispatch(receiveLocale(locale));

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locale
        };
    }

    componentDidMount() {
        setTimeout(function () {
            document.getElementById('resouceLoading').style.display = 'none';
        }, 0);
    }

    componentWillMount() {
        this.unSubscribe = store.subscribe(()=> {
            if (store.getState().locale) {
                let locale = store.getState().locale;
                document.title = locale === 'zh_CN' ? '今目标互联网工作平台' : '今目標互聯網工作平臺';
                this.state.locale !== locale && this.setState({
                    locale
                });
                this.unSubscribe();
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.locale !== this.state.locale;
    }

    render() {
        let {locale} = this.state;
        return (
            <LocaleProvider locale={locale === 'zh_TW' ? jgui_zhTW : {}}>
                <IntlProvider locale={locale} messages={locales[locale]}>
                    <Provider store={store}>
                        <Router history={history} routes={routes(store)}/>
                    </Provider>
                </IntlProvider>
            </LocaleProvider>
        );
    }
}