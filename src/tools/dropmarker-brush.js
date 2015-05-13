"use strict";

// -------------------------- ArrowRenderer -------------------------- //

var DropmarkerBrushTool = function(dropmarker){
  var self = this;
  self.DR = dropmarker;
  self.color = self.DR.color;
  self.tool = new paper.Tool();
  self.minDistance = 5;

  self.tool.onMouseDown = function(event) {
    self.onMouseDown(event);
  };

  self.tool.onMouseDrag = function(event) {
    self.onMouseDrag(event);
  };

  self.tool.onMouseUp = function(){
    self.onMouseUp();
  };
};

DropmarkerBrushTool.prototype.activate = function(){
  this.tool.activate();
}

DropmarkerBrushTool.prototype.onMouseDown = function(event) {
  this.path = new paper.Path();
  this.path.strokeColor = this.color;
  this.path.strokeWidth = '5';
}

DropmarkerBrushTool.prototype.onMouseDrag = function(event){
  this.path.add(event.point);
};

DropmarkerBrushTool.prototype.onMouseUp = function(){
  this.path.smooth();
};

// -------------------------- Arrow -------------------------- //
