var path = require('path');
var config = require(path.join(process.cwd(), './config.js'));
config.debug = false;

var makeWebpack = require('./make-webpack.config.js');
var webpackConfig = makeWebpack(config);
module.exports = webpackConfig;