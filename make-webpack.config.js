/**
 * @file make-webpack.config.js
 * @author denglb@jingoal.com
 *
 * Webpack 配置
 */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var isWebFeSelf = __dirname === process.cwd();

function getBabelLoaderInclude(appsConfig) {
    var babelLoaderInclude = [];
    fs.readdirSync(__dirname).forEach(function (file) {
        if (['dist', 'tools' , 'node_modules', 'gulpfile.js'].indexOf(file) <= 0
            && file.indexOf('.') !== 0
            && file.indexOf('.config') <= 0) {
            babelLoaderInclude.push(path.join(__dirname, file));
        }
    })

    if (!isWebFeSelf) {
        fs.readdirSync(process.cwd()).forEach(function (file) {
            if (['dist', 'tools', 'mock', 'node_modules', 'gulpfile.js'].indexOf(file) <= 0
                && file.indexOf('.') !== 0
                && file.indexOf('.config') <= 0) {
                babelLoaderInclude.push(path.join(process.cwd(), file));
            }
        });
    }

    fs.readdirSync(path.join(process.cwd(), 'node_modules')).forEach(function (file) {
        if (file.indexOf('jgfe-') === 0
            && appsConfig[file.substr(5)] !== false) {
            babelLoaderInclude.push(path.join(process.cwd(), 'node_modules/' + file));
        }
    })

    return babelLoaderInclude;
}

process.on("unhandledRejection", function(promise, reason){
    if(console && _.get(console,'log')){
        console.log(promise,'-:',reason);
    }
});
process.on('rejectionHandled', function(key) {
    if(console && _.get(console,'log')){
        console.log('key -:',key);
    }
});

/**
 * 返回 webpack 配置
 *
 * @param {Object} config, 配置信息 config.debug 为必须
 * @return {Object} webpack config
 */
module.exports = function (config) {
    var appsConfig = config.apps || {};

    if (!config) {
        /* eslint-disable */
        console.error('Config required');
        /* eslint-enable */
        return;
    }

    var NODE_ENV = process.env.NODE_ENV;
    var DEV_TEST = process.env.DEV_TEST;
    var isProduction = NODE_ENV === 'production';
    var isTest = DEV_TEST === 'test';

    var vendorsPath =  path.join(process.cwd(), 'node_modules/jgfe-common/vendors');
    var staticsPath =  path.join(process.cwd(), 'node_modules/jgfe-common/statics');
    var webpackConfig = {
        /**
         * 配置 js 入口
         */
        entry: {
            index: path.join(__dirname, './entry.js'),
            common: ['jgfe-common', 'jgui'],
            vendor: [
                'lodash', 'classnames', 'moment', 'keymirror',
                'react-redux', 'redux-thunk', 'react-router', 'react-router-redux',
                'jgfe-common/style/jgui'
            ],
        },

        /**
         * 打包目录配置
         */
        output: {
            path: path.join(process.cwd(), 'dist'),

            // 输出文件
            filename: isProduction ? 'js/[name]-[hash].min.js' : 'js/[name]-[hash].js',

            // 调试目录 或者 CDN 目录
            publicPath: isProduction ? (isTest ? '//s1.test.com/' :'//s1.jingoal.com/') : '/',

            chunkFilename: isProduction ? '[chunkhash:8].chunk.min.js' : '[chunkhash:8].chunk.js'
        },

        /**
         * webpack 插件集合
         */
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.NoErrorsPlugin(),

            // 提取样式组件
            new ExtractTextPlugin('[name]-[chunkhash:8].css'),

            new webpack.DefinePlugin({
                'process.env': {NODE_ENV: JSON.stringify(NODE_ENV)}
            }),

            // 提供共用插件
            new webpack.optimize.CommonsChunkPlugin(
                {
                    names: ["common", "vendor"],
                    filename: "js/[name]-[hash].js",
                    minChunks: Infinity,
                }
            ),

            // to: 实际为 path/xxx
            new CopyPlugin([
                {
                    from: vendorsPath,
                    to: './vendors/',
                    force: false,
                },
                {
                    from: staticsPath,
                    to: './',
                    force: false,
                },
            ]),

            // Html 插件
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, isProduction ? (isTest ? 'index-test.html' : 'index.html') : 'index-dev.html'),
                chunks: ['common', 'vendor', 'index'],
                inject: 'body'
            }),

            // Html 插件
            new HtmlWebpackPlugin({
                filename: 'approve.html',
                template:  path.join(__dirname, isProduction ? (isTest ? 'index-test.html' : 'index.html') : 'index-dev.html'),
                chunks: ['common', 'vendor', 'approve'],
                inject: 'body'
            })
        ],

        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
        },

        /**
         * 模块加载器
         */
        module: {
            preLoaders: [],
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel',
                    include: getBabelLoaderInclude(appsConfig),
                },
                {
                    test: /\.scss/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?minimize')
                },
                {
                    test: /\.(ico|gif|jpg|png|jpeg)\??.*$/,
                    loader: 'file-loader?name=imgs/[hash].[ext]'
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)\??.*$/,
                    loader: 'file-loader?name=fonts/[hash].[ext]'
                },
                {
                    test: /\.html$/,
                    loader: 'html'
                }
            ],
            postLoaders: [],
        },

        resolve: {
            alias: {
                'react-router': vendorsPath + '/react-router',
                'react-router-redux': vendorsPath + '/react-router-redux',
            }
        }
    };

    for(var i in appsConfig) {
        if (appsConfig.hasOwnProperty(i)) {
            if (appsConfig[i] === false) {
                webpackConfig.resolve.alias['jgfe-' + i] = path.join(process.cwd(), 'node_modules/jgfe-app-template');
            }
        }
    }

    // Debug 模式
    if (!isProduction && !isTest) {
        webpackConfig.devtool = 'source-map';
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
        for(var i in appsConfig) {
            if (appsConfig.hasOwnProperty(i)) {
                var app = appsConfig[i];
                if (!!app) {
                    webpackConfig.resolve.alias['jgfe-' + i] = path.join(__dirname, 'fakeApps/' + i);
                }
            }
        }
    }
    else {
        webpackConfig.devtool = false;
        webpackConfig.module.postLoaders.push(
            {
                test: /\.jsx?$/,
                loader: 'es3ify-loader',
            }
        );
        webpackConfig.plugins = webpackConfig.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false}
            })
        ]);
    }

    return webpackConfig;
};