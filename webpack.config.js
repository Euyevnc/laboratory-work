const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist'),
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  return {
    entry: './src/index.js',

    output: {
      filename: '[name].js',
      path: `${PATHS.dist}`,
      publicPath: isProduction ? './' : '/',

    },
    devServer: {
      overlay: true,
      contentBase: 'dist',
      watchContentBase: true,
      liveReload: true,
    },

    // devtool: 'eval',
    devtool: isProduction ? 'none' : 'eval',

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],

          },
          exclude: '/node_modules/',
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/images',
          },
        },

        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        // Options
                      },
                    ],
                    [
                      'autoprefixer',
                      {
                        // Options
                      },
                    ],
                    [
                      'cssnano',
                      {
                        // Options
                      },
                    ],
                    [
                      'css-mqpacker',
                      {
                        // Options
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };
};
