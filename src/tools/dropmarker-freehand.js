"use strict";

var DropmarkerFreehandTool = function(dropmarker, kind){
  var self = this;
  self.DR = dropmarker;
  self.tool = new paper.Tool();
  self.minDistance = 5;
  self.kind = kind;

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

DropmarkerFreehandTool.prototype.activate = function(){
  this.tool.activate();
};

DropmarkerFreehandTool.prototype.createPath = function() {
  this.path = new paper.Path();
  this.path.strokeColor = this.DR.color;
  this.path.strokeWidth = this.DR.pathSize;

  if(this.kind == 'highlighter'){
    this.path.strokeColor.alpha = 0.8;
    this.path.blendMode = 'multiply';
  } else {
    this.path.strokeCap = 'round';
  }
};

DropmarkerFreehandTool.prototype.drawPath = function(event){
  this.path.add(event.point);
};

DropmarkerFreehandTool.prototype.finalizePath = function(){
  this.path.simplify();
};