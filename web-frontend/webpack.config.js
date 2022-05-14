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
    port: 3000,
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
              "@babel/plugin-transform-runtime",
              ["import", { libraryName: "antd", style: "css" }],
            ],
          },
        },
      },

      {
        test: /\.(scss|css)$/,
        // 采用css modules的解析方式时，排除对node_modules文件处理
        exclude: [/node_modules/],
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // 解决使用css modules时antd样式不生效
      {
        test: /\.css$/,
        // 排除业务模块，其他模块都不采用css modules方式解析
        exclude: [/src/],
        use: ["style-loader", "css-loader"],
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
