const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const useDevServer = false;
const publicPath = useDevServer ? 'http://localhost:8080/build' : '/build/';
const isProduction = process.env.NODE_ENV === 'production'
const useSourceMaps = !isProduction;

const styleLoader = {
    loader: 'style-loader',
    options: {
        sourceMap: useSourceMaps
    }
};

const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: useSourceMaps,
        minimize: isProduction
    }
};

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true
    }
};

const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: useSourceMaps
    }
};

const webpackConfig = {
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
        layout: './assets/js/layout.js'
    },
    output: {
        path: path.resolve(__dirname, "web", "build"),
        filename: "[name].js",
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true
                    }
                }
            },

            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        cssLoader,
                    ],
                    fallback: styleLoader
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        cssLoader,
                        resolveUrlLoader,
                        sassLoader
                    ],
                    fallback: styleLoader
                })
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: '[name]-[hash:6].[ext]'
                    }
                }
            },

            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: '[name]-[hash:6].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            'widnow.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new CopyWebpackPlugin([
            { from: './assets/static', to: 'static' }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'layout',
                'manifest'
            ],
            minChunks: Infinity
        }),
        new ExtractTextWebpackPlugin('[name].css')
    ],
    devtool: useSourceMaps ? 'inline-source-map' : false,
    devServer: {
        contentBase: './web',
        headers: { 'Access-Control-Allow-Origin': '*' }
    }
};
if (isProduction) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
    webpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debugId: false
        })
    );
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('production')
        })
    )
}
module.exports = webpackConfig;