/**
 * @file server.js
 * @author wury@jingoal.com
 *
 * 本地服务 + Mock
 */
var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var httpProxy = require('http-proxy-middleware');
var https = require('https');
var http = require('http');
var packageJSON = require('../../package.json');
var webpackConfig = require(path.join(process.cwd(), './webpack.config.dev.js'));

function startMockServer(config) {
    var mockConfig = config.mock || {};
    var appsConfig = config.apps || [];
    var alias = webpackConfig.resolve.alias || {};

    process.env = process.env || {};
    process.env.REMOTE_DEBUG = mockConfig.remoteDebug;

    var routers = [];
    var mockDirs = [];

    for(var i in packageJSON.dependencies) {
        if(i.indexOf('jgfe-') === 0 && i !== "jgfe-lib") {
            if (appsConfig[i.substr(5)] !== false) {
                var mockDir = path.join(
                    (alias[i]
                        ? alias[i]
                        : path.join(process.cwd(), 'node_modules/' + i)),
                    './mock');
                if (fs.existsSync(mockDir)
                    && fs.statSync(mockDir).isDirectory()) {
                    mockDirs.push(mockDir);
                }
            }
        }
    }

    for(var i = 0, l = mockDirs.length; i < l; i ++) {
        routers = routers.concat(require(mockDirs[i]));
    }

    var app = new (require('express'))();
    app.use('/', routers);

    if (mockConfig.remoteDebug) {
        // proxy middleware options
        var proxyOptions = {
            target: mockConfig.remoteHost + (mockConfig.remotePort ? ':' + mockConfig.remotePort : ''), // target host
            changeOrigin: true,  // needed for virtual hosted sites
            ws: true,            // proxy websockets
            secure: false,
            headers: {
                //'Cookie': lodash.trim(mockConfig.remoteCookie),
                'Content-Type': 'application/json; charset=utf-8',
                // 解决跨域, 允许任意 origin
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'token, Origin, X-Requested-With, Content-Type, Accept'
            },
            onProxyRes: function (proxyRes, res, req) {
                console.log('proxy', res.url);
            }
        };

        var filter = function (pathname, req) {
            return !pathname.toLowerCase().match(
                /\.(jpeg|jpg|png|gif|css|js|swf|eot|svg|ttf|woff|html|htm|ico|webp)([?#].*)?$/
            );
        }

        var remoteProxy = httpProxy(filter, proxyOptions);
        app.use(remoteProxy);
    }

    var server;
    if (!mockConfig.secure) {
        server = http.createServer(app);
    } else {
        var options = {
            key: fs.readFileSync(__dirname + '/ssl/server.key'),
            cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
        };
        server = https.createServer(options, app);
    }

    server.listen(mockConfig.port, mockConfig.host, function (error) {
        if (error) {
            console.error(error);
        } else {
            console.info("==> MockServer is Listening on port %s. ", mockConfig.port)
        }
    })
}

module.exports = startMockServer;



