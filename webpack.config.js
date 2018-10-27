var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

var extractCss = new ExtractTextPlugin({
  filename: "app.css"
});

module.exports = {
  entry: "./src/typescript/app.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/app.js"
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: extractCss.extract({
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/"
              // publicPath: "images/",
              // useRelativePath: true
            }
          }
          // {
          //   loader: "url-loader",
          //   options: {
          //     limit: 1,
          //     name: "[name].[ext]",
          //     outputPath: "images/",
          //     publicPath: "../images/"
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    extractCss,
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: false 
    }),
    new CleanWebpackPlugin(["dist"]),
    new CopyWebpackPlugin([{ from: 'src/images/', to: 'images' }], {})
  ],
  // resolve: {
  //   alias: {
  //     cssImg: path.resolve(__dirname, "../../images/")
  //   }
  // }
};
