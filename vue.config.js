module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,

    // devServer: {
    //     // This will forward any request that does not match a static file to localhost:3000
    //     proxy: 'http://coletaSeletivaApi.test/api'
    // },

    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/'
}