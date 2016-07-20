var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'static');
var APP_DIR = path.resolve(__dirname, 'static');

module.exports = {
    entry: "./entry.js",
    output: {path: BUILD_DIR, filename: "bundle.js"},
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.less$/, loaders: ["style","css","less"]},
            {test : /\.json?/, loader : 'json'}
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({$: 'jquery',jQuery: 'jquery'})
    ],    
    node: {
      console: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
};