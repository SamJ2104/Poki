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
          // Inject the previous JavaScript code
          const injectedScript = `
            <script>
              //invert color and skip transparency value
              function invert(str, type) {
                var t1 = str.split("(");
                var t2 = t1[1].split(")");
                var t3 = t2[0].split(",");
                t3.forEach(function(v, i) {
                  if (i < 3) {
                    if (type == "color")
                      t3[i] = (255 - parseInt(v)) < 50 ? 120 : (255 - parseInt(v));
                    else
                      t3[i] = (255 - parseInt(v));
                  }
                })
                t3 = t3.join(",");
                return t1[0] + "(" + t3 + ")";
              }
              
              //invert color and backgroundcolor of every dom node
              document.querySelectorAll('*:not([invTouch])').forEach(function(node) {
                var style = window.getComputedStyle(node);
                node.style.backgroundColor = invert(style.backgroundColor, "back");
                node.style.color = invert(style.color, "color");
                node.setAttribute("invTouch", "true");
              });
            </script>
          `;
          const originalBody = body.toString();
          // Insert the injected script right before the closing </body> tag
          const modifiedBody = originalBody.replace('</body>', `${injectedScript}</body>`);
          res.setHeader('Content-Length', Buffer.byteLength(modifiedBody));
          res.write(modifiedBody);
          res.end();
        } catch (error) {
          console.error('Error injecting script:', error);
          res.writeHead(500);
          res.end();
        }
      });
    },
  })(req, res);
};