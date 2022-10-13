const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { isDev, PROJECT_PATH } = require('../conf');

const getCssLoaders = (importLoaders, isModules = false) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: isModules
        ? {
            localIdentName: '[local]-[hash:5]',
          }
        : false,
      sourceMap: isDev,
      importLoaders,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-flexbugs-fixes'),
          !isDev && [
            'postcss-preset-env',
            {
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
              stage: 3,
            },
          ],
        ].filter(Boolean),
      },
    },
  },
];

module.exports = {
  entry: {
    app: resolve(PROJECT_PATH, './src/index.tsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    path: resolve(PROJECT_PATH, './dist'),
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@Src': resolve(PROJECT_PATH, './src'),
      '@Components': resolve(PROJECT_PATH, './src/components'),
      '@Utils': resolve(PROJECT_PATH, './src/utils'),
      '@Packages': resolve(PROJECT_PATH, './src/packages'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
        },
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2, true),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(PROJECT_PATH, './public/index.html'),
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true,
          },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(PROJECT_PATH, './public'),
          from: '*',
          to: resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包',
      color: '#fa8c16',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
  ],
};
