## Dropmarker.js

Dropmarker.js adds very basic drawing capabilities in the browser. *See `demo.html` for a very basic example.*

#### Getting started:

`Dropmarker(htmlElement, backgroundSrc, readOnly)`: Creates a new Dropmarker instance, which creates a `<canvas>` element within the HTML element you passthrough.

Example:

```js
  var wrap = document.querySelector('.canvas-wrap');
  var DR = new Dropmarker(wrap, 'http://crossorigin.example.com/image.png');
```

#### Methods:

- `destroy`: Removes the canvas from the DOM and removes any event listeners
- `exportCanvas(kind, onlyDrawing)`: Exports canvas as a string. Valid kinds are: `json`, `svg`, and `image` (base64, default). Passing in `true` as the second parameter will exclude the background image from the export (only with JSON and SVG).
- `importDrawing(svg)`: Imports an SVG element (or URL) into the drawing layer of the canvas
- `isEmpty`: Returns `true` if the user has drawn on the canvas, otherwise `false`.
- `resetCanvas`: Clears the canvas to its blank state
- `setBackground(backgroundSrc)`: Changes the background
- `setColor(val)`: Sets the color for new paths. Can be any valid CSS color value.
- `setTool(name)`: Changes the active tool. Valid names are: `arrow` (default), `brush`, `highlighter`, and `select`

## Building

```
npm install
```

Then run `gulp` to bundle and minify.

## TODO

- [Zoom and pan](http://matthiasberth.com/articles/stable-zoom-and-pan-in-paperjs/)