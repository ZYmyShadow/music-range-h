/* craco.config.js */

module.exports = {
    //配置代理解决跨域
    devServer: {
        proxy: {
            "/api": {
                target: 'http://localhost:10010',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
};
