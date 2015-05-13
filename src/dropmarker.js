"use strict";

var Dropmarker = function(container){
  this.container = container;
  this.color = "red";
  this.hoverColor = "#38dedf";
  this.tools = {
    "arrow": new DropmarkerArrowTool(this),
    "brush": new DropmarkerBrushTool(this)
  };

  this.cache = {
    width: this.container.offsetWidth,
    height: this.container.offsetHeight
  };

  // kick things off
  this.create();
  this.setTool("arrow");
};


Dropmarker.prototype.create = function(){
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