var globule = require('globule');
var path = require("path");

var entry = {
  "./public/main": './src/entry.js'

};
var files = globule.find("./**/*.test.js", "!./node_modules/**", "!./jasmine/**").forEach(function(filePath){
  entry[filePath.replace(path.extname(filePath), "")] = filePath;
});

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: './',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  }
};
