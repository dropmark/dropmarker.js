## Dropmarker.js

Dropmarker.js adds very basic drawing capabilities in the browser. *See `demo.html` for a very basic example.*

#### Getting started:

```js
  var wrap = document.querySelector('.canvas-wrap');
  var DR = new Dropmarker(wrap);
```

#### Methods:

- `setTool(name)`: Changes the active tool. Valid names are: `arrow` (default) and `brush`
- `setColor(val)`: Sets the color for new paths. Can be any valid CSS color value.
- `exportCanvas(kind, background)`: Exports canvas as a string. Valid kinds are: `json` (default), `svg`, and `image`. If `kind` is set as `image`, you can also pass through an image url as a second param and it will be set as the canvas's background. **Important**: Background images must have CORS enabled, otherwise it will taint the canvas.
- `resetCanvas`: Clears the canvas to its blank state