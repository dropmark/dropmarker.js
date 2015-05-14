"use strict";

var DropmarkerBrushTool = function(dropmarker){
  var self = this;
  self.DR = dropmarker;
  self.tool = new paper.Tool();
  self.minDistance = 5;

  self.tool.onMouseDown = function() {
    if(self.DR.create)
      self.createPath();
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
};

DropmarkerBrushTool.prototype.createPath = function() {
  this.path = new paper.Path();
  this.path.strokeColor = this.DR.color;
  this.path.strokeWidth = "5";
};

DropmarkerBrushTool.prototype.drawPath = function(event){
  this.path.add(event.point);
};

DropmarkerBrushTool.prototype.finalizePath = function(){
  this.path.simplify();
};