"use strict";

var Dropmarker = function(container, options){
  this._VERSION = '1.0.1';
  this.backgroundImage = null;
  this.backgroundLayer = null;
  this.canvas = null;
  this.color = "red";
  this.create = true; // disabled when we're editing an existing shape
  this.container = container;
  this.drawingLayer = null;
  this.importedDrawing = null;
  this.onSetTool = null;
  this.onKeydown = this._handleKeyDown.bind(this);
  this.pathSize = 10;
  this.pendingLoads = 0;
  this.selectMode = false;
  this.selectedItem = null;
  this.tools = {
    select: {
      tool: new paper.Tool(),
      shortcut: 86 // v
    },
    arrow: {
      tool: new DropmarkerArrowTool(this),
      shortcut: 65 // a
    },
    brush: {
      tool: new DropmarkerFreehandTool(this, "brush"),
      shortcut: 66 // b
    },
    highlighter: {
      tool: new DropmarkerFreehandTool(this, "highlighter"),
      shortcut: 72 // h
    }
  };

  if(typeof options == 'object'){
    if(options.background) this.backgroundSrc = options.background;
    if(options.readOnly) this.readOnly = options.readOnly;
    if(options.width) this.width = options.width;
    if(options.height) this.height = options.height;
    if(options.onReady) this.onReady = options.onReady;
  }

  // kick things off
  this._init();

  if(this.backgroundSrc)
    this._loadBackground();

  if(!this.readOnly){
    this.setTool("arrow");
    this._bindListeners();
  }
};

Dropmarker.prototype.destroy = function(){
  var self = this;
  document.removeEventListener("keydown", self.onKeydown, false);

  try{
    this._resetCursor();
    this.container.classList.remove('dropmarker-active');
    this.container.classList.remove('dropmarker-readonly');
    this.container.removeChild(this.canvas);
  } catch (e) {
    // Elements probably don't exist anymore.
  }
};

Dropmarker.prototype.exportCanvas = function(kind, onlyDrawing){
  var str;

  if(onlyDrawing){
    this.backgroundLayer.remove();
  }

  switch(kind){
    case "json":
      str = paper.project.exportJSON();
      break;
    case "svg":
      str = paper.project.exportSVG({
        asString: true
      });
      break;
    default:
      str = this.canvas.toDataURL();
  }

  if(onlyDrawing){
    this.backgroundLayer.insertBelow(this.drawingLayer);
  }

  return str;
};

Dropmarker.prototype.importDrawing = function(svg){
  this.importedDrawing = svg;
  this._loaderPush();
  this.drawingLayer.removeChildren();

  this.drawingLayer.importSVG(this.importedDrawing, {
    onLoad: this._importOnLoad.bind(this),
    expandShapes: true
  });
};

Dropmarker.prototype._importOnLoad = function(data){
  this._loaderPop();
  this._scaleDrawingLayer();
}

Dropmarker.prototype._scaleDrawingLayer = function(){
  // If the SVG we import is larger than the canvas size, we need to scale it to fit within
  // TODO: We could make this optional if imported SVGs don't need scaled)
  if(!this.drawingLayer.children.length || !this.height || !this.width) return;
  var scale = paper.view.size.width / this.width;
  var center = new paper.Point(0, 0);
  this.drawingLayer.children[0].scale(scale, center);
  paper.view.update();
}

Dropmarker.prototype.isEmpty = function(){
  return this.drawingLayer.isEmpty();
},

Dropmarker.prototype.resetCanvas = function(){
  this.drawingLayer.clear();
  paper.view.update();
};

Dropmarker.prototype.setBackground = function(src){
  if(this.backgroundSrc != src){
    this.backgroundLayer.removeChildren();
    paper.view.update();
    this.backgroundSrc = src;
    this._loadBackground();
  }
};

Dropmarker.prototype.setColor = function(val){
  this.color = val;

  if(this.selectMode && this.selectedItem){
    this.selectedItem.strokeColor = val;
    paper.view.update();
  }
};

Dropmarker.prototype.setTool = function(name){
  this.selectMode = (name == "select");

  if(this.selectMode){
    this._setCursor("auto");
  }

  this._deselectSelectedItem();
  paper.view.update();
  this.tools[name].tool.activate();

  if(typeof this.onSetTool === 'function') this.onSetTool(name);
};

Dropmarker.prototype.setSize = function(val){
  this.pathSize = val;
};

Dropmarker.prototype._init = function(){
  if(this.readOnly){
    // Fixes scaling imported SVG's on smaller canvases
    paper.settings.applyMatrix = false;
  }

  // Create canvas
  this.canvas = document.createElement("canvas");
  this.container.appendChild(this.canvas);

  // Create a Paper project
  paper.setup(this.canvas);
  this.backgroundLayer = new paper.Layer();
  this.drawingLayer = new paper.Layer();
  this.drawingLayer.activate();
  this.container.classList.add("dropmarker-active");

  if(this.readOnly)
    this.container.classList.add("dropmarker-readonly");
};

Dropmarker.prototype._loadBackground = function(){
  this.backgroundImage = new Image();
  this._loaderPush();

  this.backgroundImage.onload = function(){
    this._loaderPop();
    this._setBackground();
  }.bind(this);

  // See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
  this.backgroundImage.crossOrigin = 'anonymous';
  this.backgroundImage.src = this.backgroundSrc;
};

Dropmarker.prototype._loaderPush = function(){
  this.pendingLoads++;

  if(this.pendingLoads == 1){
    this.container.classList.add('dropmarker-loading');
  }
};

Dropmarker.prototype._loaderPop = function(){
  this.pendingLoads--;

  if(this.pendingLoads == 0){
    this.container.classList.remove('dropmarker-loading');
  }
};

Dropmarker.prototype._setBackground = function(){
  var image = this.backgroundImage;
  this.backgroundLayer.activate();
  paper.view.viewSize = new paper.Size(image.width, image.height);
  paper.view.update();
  new paper.Raster(image, new paper.Point(image.width / 2, image.height / 2));
  this.drawingLayer.activate();
  paper.view.update();

  if(this.onReady)
    this.onReady();
};

Dropmarker.prototype._setCursor = function(value){
  this.container.style.cursor = value;
};

Dropmarker.prototype._resetCursor = function(){
  this.container.style.removeProperty("cursor");
};

Dropmarker.prototype._deselectSelectedItem = function(){
  if(this.selectedItem){
    this.selectedItem.fullySelected = false;
  }
};

Dropmarker.prototype._selectItem = function(item){
  if(this.selectedItem && this.selectedItem.id != item.id)
    this._deselectSelectedItem();

  item.fullySelected = true;
  this.selectedItem = item;
};

Dropmarker.prototype._moveItem = function(item, point){
  this.create = false;
  item.position = point;
};

Dropmarker.prototype._handleKeyDown = function(e){
  var tag = e.target.tagName.toLowerCase();
  if(tag == 'input' || tag == 'textarea') return;

  if(this.selectMode && e.keyCode == 8){ // backspace
    e.preventDefault();
    this.selectedItem.remove();
    paper.view.update();
  } else {
    for(var tool in this.tools){
      if(this.tools.hasOwnProperty(tool) && this.tools[tool].shortcut == e.keyCode)
        this.setTool(tool);
    }
  }
};

Dropmarker.prototype._bindListeners = function(){
  var self = this;
  var selectTool = self.tools.select.tool;
  document.addEventListener("keydown", self.onKeydown, false);

  selectTool.onMouseDown = function(event){
    // Deselect any items if we're clicking the background
    if(event.item instanceof paper.Raster){
      self._deselectSelectedItem();
    }
  };
};