## Dropmarker.js

Dropmarker.js adds very basic drawing capabilities in the browser. *See `demo.html` for a very basic example.*

Creating a Dropmarker instance:

```
  var wrap = document.querySelector('.canvas-wrap');
  var DR = new Dropmarker(wrap);
```

Methods:

- `setTool(name)`: Changes the active tool. Available options are `arrow` (default) and `brush`
- `resetCanvas`: Clears the canvas to its blank state