## Dropmarker.js

Dropmarker.js adds very basic drawing capabilities in the browser. *See `demo.html` for a very basic example.*

#### Getting started:

`Dropmarker(htmlElement, base64String)`: Creates a new Dropmarker instance, which creates a `<canvas>` element within the HTML element you passthrough and sets the background to the base64 string if you pass one through. (We use a base64 image in order to not taint the canvas)

Example:

```js
  var wrap = document.querySelector('.canvas-wrap');
  var DR = new Dropmarker(wrap, base64str);
```

#### Methods:

- `setTool(name)`: Changes the active tool. Valid names are: `arrow` (default), `brush`, and `highlighter`
- `setColor(val)`: Sets the color for new paths. Can be any valid CSS color value.
- `exportCanvas(kind)`: Exports canvas as a string. Valid kinds are: `json`, `svg`, and `image` (base64, default).
- `resetCanvas`: Clears the canvas to its blank state

## Building

```
npm install
```

Then run `gulp` to bundle and minify.