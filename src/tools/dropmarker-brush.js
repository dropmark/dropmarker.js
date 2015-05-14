"use strict";

// -------------------------- ArrowRenderer -------------------------- //

var DropmarkerBrushTool = function(dropmarker){
  var self = this;
  self.DR = dropmarker;
  self.color = self.DR.color;
  self.tool = new paper.Tool();
  self.minDistance = 5;

  self.tool.onMouseDown = function(event) {
    if(self.DR.create)
      self.createPath(event);
  };

  self.tool.onMouseDrag = function(event) {
    if(self.DR.create)
      self.drawPath(event);
  };

  self.tool.onMouseUp = function(){
    if(self.DR.create)
      self.finalizePath();
  };
};

DropmarkerBrushTool.prototype.activate = function(){
  this.tool.activate();
}

DropmarkerBrushTool.prototype.createPath = function(event) {
  this.path = new paper.Path();
  this.path.strokeColor = this.color;
  this.path.strokeWidth = '5';
}

DropmarkerBrushTool.prototype.drawPath = function(event){
  this.path.add(event.point);
};

DropmarkerBrushTool.prototype.finalizePath = function(){
  this.path.smooth();
};

// -------------------------- Arrow -------------------------- //
