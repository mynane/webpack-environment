/**
 * @file config.js
 * @author wury
 *
 *
 */
var fs = require('fs');

var config = {
    /**
     * 国际版开关
     * @params {boolean} true, false
     */
    isInternational: true,
    /**
     * dev 开关
     * @params {boolean} true, false
     */
    debug: true,

    /**
     * host
     * @params {string}
     */
    host: '0.0.0.0',

    /**
     * 监听端口
     * @params {number}
     */
    port: 4000,


    mock: {

        host: '127.0.0.1',

        /**
         * mock 监听端口
         * @params {number}
         */
        port: 5000,

        /**
         * dev 开关
         * @params {boolean} true, false
         */
        remoteDebug: true,

        /**
         * mock 监听端口
         * @params {number}
         */
        remoteHost: 'https://web.test.com',

        /**
         * mock 监听端口
         * @params {number}
         */
        remotePort: '',

        remoteCookie: fs.readFileSync(process.cwd() + '/cookies.txt').toString(),

        secure: true

    },

    apps: {
        'worklog': false,
        'igoal':false,
    },
}

module.exports = config;