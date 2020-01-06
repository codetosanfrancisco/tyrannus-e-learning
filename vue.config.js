module.exports = {
  "devServer": {
    "disableHostCheck": true
  },
  "configureWebpack": {
    "module": {
      "rules": [
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
      ]
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}