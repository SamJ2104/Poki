const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "https://www.crazygames.com/"; // Your website URL

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Rewrite the path to include the target URL
      return path.replace(/^\/(.*)/, `${target}$1`);
    },
  })(req, res);
};
