const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackHtmlPlugin = require('webpack-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: path.join(__dirname, './built/main.js'),
    vendor: [
      '@angular/common',
      '@angular/core',
      '@angular/forms',
      '@angular/http',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      'angular-in-memory-web-api',
      'core-angularJS',
      'rxjs',
      'zone.js'
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'blog.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        use: ExtractTextPlugin.extract({
          use: 'html-loader'
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    }),
    new UglifyJsPlugin({
      beautify: false,
      output: {
        comments: false
      },
      mangle: {
        screw_ie8: true
      },
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      },
    }),
    new WebpackHtmlPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      // These files are all static.
      'styles.css',
      'twitter.js',
      'app/app.component.html',
      'app/about/about.component.html',
      'app/articles/articles.component.css',
      'app/articles/articles.component.html',
      'app/articles/article-view.component.css',
      'app/articles/article-view.component.html',
      'app/articles/article-search.component.css',
      'app/articles/article-search.component.html'
    ].map(filename => (
      {
        // Take the resources from deep within the development directory structure.
        from: `src/${filename}`,
        // The files automatically go into the dist/ directory, i.e. the web root, due to the above configuration.
        // This strips just the filename and places it in the web root.
        to: `${filename.slice(filename.lastIndexOf('/') + 1)}`
      }
    )))
    // Uncomment for a web-ui analysis of the bundle sizes.
//    ,
//    new BundleAnalyzerPlugin({
//      analyzerMode: 'static'
//    })
  ],
  resolve: {
    extensions: [ '.js', '.css' ]
  },
  node: {
    fs: 'empty'
  }
};
