const webpack = require('webpack');
const path = require('path');

module.exports = env => {
    console.log('::-->>__SERVER__<<--::');

    return {
        entry: {
            app: ['webpack-hot-middleware/client?overlay=false&quiet=true', './boilerplate/docs/docs.js']
        },
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            },
            hot: true,
            stats: {
                children: false
            }
        },
        output: {
            publicPath: '/assets'
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        'style-loader',
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
                }
            ]
        },
        plugins: [new webpack.HotModuleReplacementPlugin()]
    };
};
