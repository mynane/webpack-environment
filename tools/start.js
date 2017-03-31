/**
 * Created by rongyao on 2016/11/15.
 */
var fs = require('fs');
var path = require('path');
var server = require('./server');
var mockServer = require('./mock/server');
var config = require(path.join(process.cwd(), './config.js'));

server(config);
mockServer(config);