"use strict";

var Dropmarker = function(container){
  this.canvas = null;
  this.create = true; // disabled when we're editing an existing shape
  this.color = "red";
  this.container = container;
  this.cache = {
    width: this.container.offsetWidth,
    height: this.container.offsetHeight
  };
  this.selectedItem = null;
  this.tools = {
    "arrow": new DropmarkerArrowTool(this),
    "brush": new DropmarkerBrushTool(this)
  };

  // kick things off
  this._init();
  this.setTool("arrow");
};

Dropmarker.prototype.exportCanvas = function(kind, background){
  var str;
  var self = this;

  switch(kind){
    case 'image':
      if(background) self._setBackground(background);
      str = self.canvas.toDataURL();
      if(background) self._resetBackground();
      break;
    case 'svg':
      str = paper.project.exportSVG();
      break;
    default:
      str = paper.project.exportJSON();
  }

  return str;
};

Dropmarker.prototype.resetCanvas = function(){
  paper.project.clear();
  paper.view.update();
  this._resetCursor();
};

Dropmarker.prototype.setTool = function(name){
  this.tools[name].activate();
};

Dropmarker.prototype.setColor = function(val){
  this.color = val;
};

Dropmarker.prototype._init = function(){
  // Create canvas
  this.canvas = document.createElement("canvas");
  this.canvas.style.width = this.cache.width + "px";
  this.canvas.style.height = this.cache.height + "px";
  this.container.appendChild(this.canvas);

  // Create a Paper project
  paper.setup(this.canvas);

  this.container.classList.add("dropmarker-active");
  this.container.style.position = "relative";
  this.container.style.width = this.cache.width;
  this.container.style.height = this.cache.height;
};

Dropmarker.prototype._setBackground = function(background){
  this.background = new paper.Raster(background);
  paper.view.draw();
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

Dropmarker.prototype._moveItem = function(item, point){
  this.create = false;
  item.position = point;
};

Dropmarker.prototype._toggleSelectedItem = function(item){
  if(this.selectedItem && this.selectedItem.id != item.id)
    this._deselectSelectedItem();

  if(item.fullySelected){
    item.fullySelected = false;
    this.selectedItem = null;
  } else {
    item.fullySelected = true;
    this.selectedItem = item;
  }
};