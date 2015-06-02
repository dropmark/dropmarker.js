## Dropmarker.js

Dropmarker.js adds very basic drawing capabilities in the browser. *See `demo.html` for a very basic example.*

#### Getting started:

`Dropmarker(htmlElement, backgroundSrc)`: Creates a new Dropmarker instance, which creates a `<canvas>` element within the HTML element you passthrough.

Example:

```js
  var wrap = document.querySelector('.canvas-wrap');
  var DR = new Dropmarker(wrap, 'http://crossorigin.example.com/image.png');
```

#### Methods:

- `destroy`: Removes the canvas from the DOM and removes any event listeners
- `exportCanvas(kind)`: Exports canvas as a string. Valid kinds are: `json`, `svg`, and `image` (base64, default).
- `resetCanvas`: Clears the canvas to its blank state
- `setTool(name)`: Changes the active tool. Valid names are: `arrow` (default), `brush`, `highlighter`, and `select`
- `setColor(val)`: Sets the color for new paths. Can be any valid CSS color value.

## Building

```
npm install
```

Then run `gulp` to bundle and minify.