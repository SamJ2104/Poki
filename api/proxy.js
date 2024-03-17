const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "https://www.google.com/"; // your website url

  createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      let body = Buffer.from('');
      proxyRes.on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
      });
      proxyRes.on('end', () => {
        try {
          // Inject dark mode CSS
          const darkModeCSS = `
            <style>
              body {
                background-color: #1e1e1e;
                color: #dcdcdc;
              }
              /* Add more styles as needed */
            </style>
          `;
          const originalBody = body.toString();
          // Insert the dark mode CSS right after the opening <head> tag
          const modifiedBody = originalBody.replace('<head>', `<head>${darkModeCSS}`);
          res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
          res.write(modifiedBody);
          res.end();
        } catch (error) {
          console.error('Error injecting dark mode CSS:', error);
          res.writeHead(500);
          res.end();
        }
      });
    },
  })(req, res);
};