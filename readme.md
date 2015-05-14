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
- `exportCanvas(kind)`: Exports canvas as a string. Valid kinds are: `json`, `svg`, and `image` (base64, default).
- `resetCanvas`: Clears the canvas to its blank state