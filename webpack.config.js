const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/webview/index.tsx',
  output: {
    path: path.resolve(__dirname, 'media'),
    filename: 'webview.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};