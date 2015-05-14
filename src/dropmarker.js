"use strict";

var Dropmarker = function(container, image64){
  this.canvas = null;
  this.create = true; // disabled when we're editing an existing shape
  this.color = "red";
  this.container = container;
  this.image64 = image64;
  this.pathSize = 10;
  this.selectedItem = null;
  this.tools = {
    "arrow": new DropmarkerArrowTool(this),
    "brush": new DropmarkerFreehandTool(this, 'brush'),
    "highlighter": new DropmarkerFreehandTool(this, 'highlighter')
  };

  // kick things off
  this._init();

  if(this.image64){
    this._setBackground();
  }

  this.setTool("arrow");
};

Dropmarker.prototype.exportCanvas = function(kind){
  var str;
  var self = this;

  switch(kind){
    case 'json':
      str = paper.project.exportJSON();
      break;
    case 'svg':
      str = paper.project.exportSVG();
      break;
    default:
      str = self.canvas.toDataURL();
  }

  return str;
};

Dropmarker.prototype.resetCanvas = function(){
  paper.project.clear();
  paper.view.update();
  this._resetCursor();
  this._setBackground();
};

Dropmarker.prototype.setTool = function(name){
  this.tools[name].activate();
};

Dropmarker.prototype.setColor = function(val){
  this.color = val;
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

  this.container.classList.add("dropmarker-active");
};

Dropmarker.prototype._setBackground = function(){
  var image = new Image();
  image.src = this.image64;

  paper.view.viewSize = new paper.Size(image.width, image.height);
  paper.view.update();
  new paper.Raster(image, new paper.Point(image.width / 2, image.height / 2));
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