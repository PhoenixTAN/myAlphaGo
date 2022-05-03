const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const env = {
  TITLE: "Ziqi Tan",
};

module.exports = {
  mode: "development",

  entry: "./src/index.tsx",

  // track down errors and warnings to their original location
  devtool: "inline-source-map",

  // a simple web server and the ability to use live reloading
  devServer: {
    contentBase: "./dist",
  },

  plugins: [
    new CleanWebpackPlugin(), // clean up dist folder
    new HtmlWebpackPlugin({
      title: env.TITLE,
      template: __dirname + "/src/index.html",
      filename: "index.html",
      inject: "body",
    }),
  ],

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: __dirname + "/tsconfig.json",
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/typescript",
              "@babel/preset-react",
            ],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread",
            ],
          },
        },
      },

      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: "file-loader",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
};
