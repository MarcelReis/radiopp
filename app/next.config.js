module.exports = {
  webpack: (config) => {
    config.module.rules.push({ test: /\.graphql?$/, loader: 'webpack-graphql-loader' })

    return config
  },
}