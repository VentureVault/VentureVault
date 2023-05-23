const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');


module.exports = {

  entry: './client/index.js', 

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },

  mode: process.env.NODE_ENV,

  plugins: [
    new HTMLWebpackPlugin({
      template: './client/index.html'
    }),
  ],

  module: {
    rules: [
      {
        test: /.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /.(css|s[ac]ss)$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }

}