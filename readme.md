## Dropmarker.js

`bindPanListener(element, callback)`: Binds to the `pan` event

## Renderers

A renderer determines what happens when a user pans (or click + drags) on the canvas. When a user pans, the renderer's `render` method is called with the `x` and `y` positions (relative to the canvas).