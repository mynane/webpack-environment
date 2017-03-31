/**
 * @file server.js
 * @author wury@jingoal.com
 *
 * 本地服务 + Mock
 */
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require(path.join(process.cwd(), './webpack.config.dev.js'));

function startServer(config) {
    var mockConfig = config.mock;
    var compiler = webpack(webpackConfig);

    /**
     * webpack dev server 配置
     */
    var server = new WebpackDevServer(compiler, {
        contentBase: '',
        publicPath: webpackConfig.output.publicPath,
        noInfo: false,
        hot: false,
        port: config.port,
        historyApiFallback: true,
        compress: true,
        inline: true,
        watch: true,
        stats: {
            cached: false,
            colors: true
        },
        proxy: {
            '*': {
                target: (mockConfig.secure ? 'https' : 'http') + '://' + mockConfig.host + ':' + mockConfig.port,
                secure: false,
                bypass: function (req, res, proxyOptions) {
                    if (req.url.toLowerCase().match(
                            /\.(jpeg|jpg|png|gif|css|js|swf|eot|svg|ttf|woff|html|htm|ico|webp)([?#].*)?$/)) {
                        console.log('Skipping proxy for browser request.');
                        console.log(req.url);//return req.url;
                    }
                    console.log(req.url);
                }
            }
        },
    });

    server.app.use(webpackHotMiddleware(compiler));

    /**
     * 启动本地服务环境
     */
    server.listen(config.port, config.host, function (error) {
        /* eslint-disable */
        if (error) {
            console.error(error);
        } else {
            console.info('==> Listening on port %s. ' +
                'Open up http://' + config.host + ':%s/ in your browser.',
                config.port, config.port);
        }
        /* eslint-enable */
    });
}


module.exports = startServer;