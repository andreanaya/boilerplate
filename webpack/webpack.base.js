const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = env => {
    const isAnalize = env && env.anlz ? new BundleAnalyzerPlugin() : [];

    return {
        devtool: 'source-map',
        entry: {
            app: ['./app'],
            vendor: [
                'babel-polyfill',
                'TweenLite',
                'Expo',
                'gsap/CSSPlugin',
                'formdata-polyfill',
                './.modernizrrc'
            ]
        },
        output: {
            path: path.resolve(__dirname, '../../dist'),
            publicPath: '/assets/dist/',
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.js', '.scss'],
            modules: [
                '../app',
                '../app/components',
                '../app/general/js',
                '../app/general/scss',
                '../app/general/img',
                '../app/general/fonts',
                '../app/general/video',
                'node_modules'
            ],
            alias: {
                modernizr$: path.resolve(__dirname, '../../.modernizrrc'),
                settings: path.resolve(
                    __dirname,
                    '../general/scss/settings/index.scss'
                ),
                boilerplate: path.resolve(__dirname, '../'),
                config: path.resolve(__dirname, '../../config/'),
                TweenLite: 'gsap/TweenLite',
                Expo: 'gsap/EasePack'
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: {
                        partialResolver: function(partial, callback){
                            callback(null, path.resolve(__dirname, '../../app', partial));
                        },
                        knownHelpers: Object.keys(require('../../app/layout/helpers.js'))
                    }
                },
                {
                    test: /\.modernizrrc(\.json)?$/,
                    use: ['modernizr-loader', 'json-loader']
                },
                {
                    test: /\.(png|svg|jpe?g|gif)$/,
                    exclude: /svg[\/\\]/,
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                },
                {
                    test: /\.svg$/,
                    include: /svg[\/\\]/,
                    loader: 'svg-sprite-loader',
                    options: {
                        symbolId: 'icon-[name]_[folder]'
                    }
                },
                {
                    test: /\.glsl$/,
                    loader: 'webpack-glsl-loader'
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin('dist', {
                root: path.resolve(__dirname, '../..')
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
            new webpack.NamedModulesPlugin(),
            new webpack.NamedChunksPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime'
            })
        ].concat(isAnalize),
        stats: {
            children: false
        }
    };
};
