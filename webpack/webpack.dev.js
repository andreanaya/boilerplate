const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
    console.log('::-->>__DEVELOPMENT__<<--::');

    return {
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 2
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "@epegzz/sass-vars-loader",
                                options: {
                                    files: [
                                        path.resolve(__dirname, '../../config/styleguide.json')
                                    ],
                                },
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            }),
            new ManifestPlugin()
        ]
    }
};
