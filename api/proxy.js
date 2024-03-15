const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "https://www.crazygames.com/"; // Your website URL

  // Check if the request is made through a link click
  if (req.headers.referer && req.headers.referer.startsWith(target)) {
    // Intercept only if the referer is from the target website
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })(req, res);
  } else {
    // If not from a link click, pass the request through
    res.end();
  }
};
