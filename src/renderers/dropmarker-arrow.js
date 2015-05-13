"use strict";

// -------------------------- ArrowRenderer -------------------------- //

var DropmarkerArrowRenderer = function(dropmarker){
  this.DR = dropmarker;
  this.arrow = null;
};

DropmarkerArrowRenderer.prototype.render = function(x, y){
  if(!this.arrow){
    this.arrow = new DropmarkerArrow(this.DR);
  }

  this.arrow.create(x, y);
};

DropmarkerArrowRenderer.prototype.finalize = function(){
  this.arrow.createAnchors();
  this.arrow = null;
};

// -------------------------- Arrow -------------------------- //

var DropmarkerArrow = function(dropmarker){
  this.DR = dropmarker;
  this.polygon = null;
};

DropmarkerArrow.prototype.create = function(x, y){
  var self = this;
  if(!self.start){
    self.start = { x: x, y: y };
  }

  if(self.polygon){
    // Remove previous item from scene
    self.DR.two.remove(self.polygon);
  }

  self.polygon = self.DR.two.makeLine(self.start.x, self.start.y, x, y);
  self.polygon.stroke = "rgba(255, 0, 0, 0.85)";
  self.polygon.linewidth = 5;
  self.DR.two.update();
};

DropmarkerArrow.prototype.createAnchors = function(){
  var self = this;
  var translation = self.polygon.translation;

  self.polygon.vertices.forEach(function(anchor, i){
    new DropmarkerAnchor(self.DR, self.polygon, anchor);
  });
};