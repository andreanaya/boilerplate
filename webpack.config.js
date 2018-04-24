const merge = require('webpack-merge');
const baseConfig = require('./webpack/webpack.base.js');
const devConfig = require('./webpack/webpack.dev.js');
const prodConfig = require('./webpack/webpack.prod.js');
const serverConfig = require('./webpack/webpack.server.js');

module.exports = (env) => {
    const isDev = env && env.dev;
    const isDevServer = process.argv[1].indexOf('server') >= 0;

    if (isDevServer) {
        return merge.smart(
            baseConfig(env),
            serverConfig(env)
        );
    } else if (isDev) {
        return merge.smart(
            baseConfig(env),
            devConfig(env)
        );
    } else {
        return merge.smart(
            baseConfig(env),
            prodConfig(env)
        );
    }
};