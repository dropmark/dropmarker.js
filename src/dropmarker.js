"use strict";

var Dropmarker = function(container, imageSrc){
  this._VERSION = '1.0.1';
  this.backgroundLayer = null;
  this.canvas = null;
  this.color = "red";
  this.create = true; // disabled when we're editing an existing shape
  this.container = container;
  this.drawingLayer = null;
  this.imageSrc = imageSrc;
  this.onSetTool = null;
  this.onKeydown = this._handleKeyDown.bind(this);
  this.pathSize = 10;
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

  // kick things off
  this._init();

  if(this.imageSrc)
    this._setBackground();

  this.setTool("arrow");
  this._bindListeners();
};

Dropmarker.prototype.destroy = function(){
  var self = this;
  document.removeEventListener("keydown", self.onKeydown, false);
  this.container.removeChild(this.canvas);
  this.container.classList.remove('dropmarker-active');
  this._resetCursor();
};

Dropmarker.prototype.exportCanvas = function(kind){
  var str;
  var self = this;

  switch(kind){
    case "json":
      str = paper.project.exportJSON();
      break;
    case "svg":
      str = paper.project.exportSVG();
      break;
    default:
      str = self.canvas.toDataURL();
  }

  return str;
};

Dropmarker.prototype.isEmpty = function(){
  return this.drawingLayer.isEmpty();
},

Dropmarker.prototype.resetCanvas = function(){
  this.drawingLayer.clear();
  paper.view.update();
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

Dropmarker.prototype.setColor = function(val){
  this.color = val;

  if(this.selectMode && this.selectedItem){
    this.selectedItem.strokeColor = val;
    paper.view.update();
  }
};

Dropmarker.prototype.setSize = function(val){
  this.pathSize = val;
};

Dropmarker.prototype._init = function(){
  // Create canvas
  this.canvas = document.createElement("canvas");
  this.container.appendChild(this.canvas);

  // Create a Paper project
  paper.setup(this.canvas);
  this.backgroundLayer = new paper.Layer();
  this.drawingLayer = new paper.Layer();
  this.drawingLayer.activate();

  this.container.classList.add("dropmarker-active");
};

Dropmarker.prototype._setBackground = function(){
  var image = new Image();
  var self = this;

  image.onload = function(){
    self.backgroundLayer.activate();
    paper.view.viewSize = new paper.Size(image.width, image.height);
    paper.view.update();
    new paper.Raster(image, new paper.Point(image.width / 2, image.height / 2));
    paper.view.draw();
    self.drawingLayer.activate();
  };

  image.src = this.imageSrc;
};

Dropmarker.prototype._resetBackground = function(){
  this.background.remove();
  paper.view.update();
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
  if(this.selectMode && e.keyCode == 8){ // backspace
    e.preventDefault();
    this.selectedItem.remove();
    paper.view.update();
  } else {
    for(var tool in this.tools){
      if(this.tools.hasOwnProperty(tool) && this.tools[tool].shortcut == e.keyCode) {
        this.setTool(tool);
      }
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