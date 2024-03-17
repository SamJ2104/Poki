// pages/api/proxy.js

export default function handler(req, res) {
  const wikipediaUrl = 'https://en.wikipedia.org';

  // Make a request to the Wikipedia URL
  fetch(wikipediaUrl)
    .then((response) => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Read the response body as text
      return response.text();
    })
    .then((html) => {
      // Inject the JavaScript code into the HTML
      const modifiedHtml = injectJavaScript(html);
      // Send the modified HTML as the response
      res.status(200).send(modifiedHtml);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    });
}

function injectJavaScript(html) {
  // Inject the provided JavaScript code into the HTML
  const injectedCode = `
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

  // Inject the JavaScript code before the closing </body> tag
  const modifiedHtml = html.replace('</body>', `${injectedCode}</body>`);

  return modifiedHtml;
}