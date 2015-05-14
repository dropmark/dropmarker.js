"use strict";

var Dropmarker = function(container){
  this.create = true; // disabled when we're editing an existing shape
  this.container = container;
  this.cache = {
    width: this.container.offsetWidth,
    height: this.container.offsetHeight
  };
  this.color = "red";
  this.hoverColor = "#38dedf";
  this.selectedItem = null;
  this.tools = {
    "arrow": new DropmarkerArrowTool(this),
    "brush": new DropmarkerBrushTool(this)
  };

  // kick things off
  this.init();
  this.setTool("arrow");
};


Dropmarker.prototype.init = function(){
  // Create canvas
  this.canvas = document.createElement('canvas');
  this.canvas.style.width = this.cache.width + 'px';
  this.canvas.style.height = this.cache.height + 'px';
  this.container.appendChild(this.canvas);

  // Create a Paper project
  paper.setup(this.canvas);

  this.container.classList.add("dropmarker-active");
  this.container.style.position = "relative";
  this.container.style.width = this.cache.width;
  this.container.style.height = this.cache.height;
};

Dropmarker.prototype.setTool = function(name){
  this.tools[name].activate();
}

Dropmarker.prototype.setCursor = function(value){
  this.container.style.cursor = value;
}

Dropmarker.prototype.resetCursor = function(){
  this.container.style.removeProperty('cursor');
}

Dropmarker.prototype.deselectSelectedItem = function(){
  if(this.selectedItem){
    this.selectedItem.fullySelected = false;
  }
}

Dropmarker.prototype.toggleSelectedItem = function(item){
  if(this.selectedItem && this.selectedItem.id != item.id)
    this.deselectSelectedItem();

  if(item.fullySelected){
    item.fullySelected = false;
    this.selectedItem = null;
  } else {
    item.fullySelected = true;
    this.selectedItem = item;
  }
}