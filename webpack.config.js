const path = require("path"),
  HTMLWebpackPlugin = require("html-webpack-plugin"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  TerserWebpackPlugin = require("terser-webpack-plugin"),
  { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = isDev ? false : true;

const getPlugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist"),
      },
    ]),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ];

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (val) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    },
    "css-loader",
  ];

  if (val) {
    loaders.push(val);
  }

  return loaders;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      },
    },
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.js"],
    analytics: "./analytics.js",
  },
  output: {
    // add dynamic key name = main, analytics
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      "@modules": path.resolve(__dirname, "src/modules"),
      "@": path.resolve(__dirname, "src/"),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 8080,
    hot: isDev,
  },
  devtool: isDev ? "source-map" : "",
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ca]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'images'
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)/,
        loader: 'file-loader',
        options: {
          outputPath: 'fonts'
        }
      },
    ],
  },
};
