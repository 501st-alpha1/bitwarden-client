const path = require('path')
module.exports = {
    target: 'web',
    entry: './src/index.js',
    output: {
      filename: './dist/bitwarden.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
              {
                  loader: 'babel-loader',
                  options: {
                      presets: ['@babel/preset-env', '@babel/preset-stage-3']
                  },
              },
          ]
        }
      ]
    }
  };