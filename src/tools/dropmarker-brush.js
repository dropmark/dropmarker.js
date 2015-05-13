"use strict";

// -------------------------- ArrowRenderer -------------------------- //

var DropmarkerBrushTool = function(dropmarker){
  var self = this;
  self.DR = dropmarker;
  self.tool = new paper.Tool();

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

DropmarkerBrushTool.prototype.onMouseDrag = function(toolEvent){
  console.log('onMouseDrag');
};

DropmarkerBrushTool.prototype.onMouseUp = function(){
  console.log('onMouseUp');
};

// -------------------------- Arrow -------------------------- //
