"use strict";

// -------------------------- Tool -------------------------- //

var DropmarkerFreehandTool = function(dropmarker, kind){
  var self = this;
  self.DR = dropmarker;
  self.tool = new paper.Tool();
  self.minDistance = 5;
  self.path = null;

  self.tool.onMouseDown = function() {
    if(self.DR.create)
      self.path = new DropmarkerFreehandPath(self.DR, kind);
  };

  self.tool.onMouseDrag = function(event) {
    if(self.DR.create)
      self.path.draw(event);
  };

  self.tool.onMouseUp = function(){
    if(self.DR.create)
      self.path.finalize();
  };
};

DropmarkerFreehandTool.prototype.activate = function(){
  this.tool.activate();
  this.DR._setCursor('crosshair');
  this.DR.create = true;
};

// -------------------------- Path -------------------------- //
var DropmarkerFreehandPath = function(dropmarker, kind) {
  this.DR = dropmarker;
  this.kind = kind;
  this.path = new paper.Path();
  this.path.strokeColor = this.DR.color;
  this.path.strokeWidth = this.DR.pathSize;
  this.path.strokeCap = 'round';

  if(this.kind == 'highlighter'){
    this.path.strokeColor.alpha = 0.8;
    this.path.blendMode = 'multiply';
  }
};

DropmarkerFreehandPath.prototype.draw = function(event){
  this.path.add(event.point);
};

DropmarkerFreehandPath.prototype.finalize = function(){
  var self = this;

  self.path.smooth();

  self.path.onMouseDown = function(event){
    if(!self.DR.selectMode) return;

    self.DR._deselectSelectedItem();
    self.DR._selectItem(self.path);
  };

  self.path.onMouseDrag = function(event){
    if(!self.DR.selectMode) return;
    self.DR._moveItem(self.path, event.point);
  };

  self.path.onMouseUp = function(){
    if(!self.DR.selectMode) return;
    self.DR._selectItem(self.path);
    self.DR.create = true;
  };

  self.path.onClick = function(){
    if(!self.DR.selectMode) return;
    self.updateCursor();
  };

  self.path.onMouseEnter = function(){
    if(!self.DR.selectMode) return;
    self.updateCursor();
  };

  self.path.onMouseLeave = function(){
    if(!self.DR.selectMode) return;
    self.DR._resetCursor();
  };
};

DropmarkerFreehandPath.prototype.updateCursor = function(){
  if(this.path.fullySelected){
    this.DR._setCursor("move");
  } else {
    this.DR._setCursor("pointer");
  }
}