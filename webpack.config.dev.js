/**
 * @file webpack.config.js
 * @author denglb@jingoal.com
 *
 * Webpack 构建入口，直接关闭 debug 模式
 */
var path = require('path');
var config = require(path.join(process.cwd(), './config.js'));
var makeWebpack = require('./make-webpack.config.js');

var webpackConfig = makeWebpack(config);

module.exports = webpackConfig;