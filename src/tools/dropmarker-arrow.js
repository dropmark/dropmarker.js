"use strict";

// -------------------------- Tool -------------------------- //

var DropmarkerArrowTool = function(dropmarker){
  var self = this;
  self.DR = dropmarker;
  self.arrow = null;
  self.tool = new paper.Tool();

  self.tool.onMouseDrag = function(event) {
    self.onMouseDrag(event);
  };

  self.tool.onMouseDown = function(event){
    self.startingPoint = event.point;
  };

  self.tool.onMouseUp = function(){
    self.onMouseUp();
  };
};

DropmarkerArrowTool.prototype.activate = function(){
  this.tool.activate();
};

DropmarkerArrowTool.prototype.onMouseDrag = function(toolEvent){
  if(!this.DR.create) return;

  if(!this.arrow){
    this.DR._deselectSelectedItem();
    this.arrow = new DropmarkerArrow(this.DR, this.startingPoint);
  }

  this.arrow.draw(toolEvent);
};

DropmarkerArrowTool.prototype.onMouseUp = function(){
  if(this.arrow){
    this.arrow.finalize();
    this.arrow = null;
  }
};

// -------------------------- Arrow -------------------------- //

var DropmarkerArrow = function(dropmarker, startingPoint){
  this.DR = dropmarker;
  this.color = this.DR.color;
  this.startingPoint = startingPoint;
  this.endingPoint = null;
  this.movingPoint = null; // set when we click and drag a point
  this.linePath = null;
};

DropmarkerArrow.prototype.draw = function(toolEvent){
  var self = this;

  // Since we're using paper-core, we need to use the `pointA.subtract` and `pointA.add`
  // methods rather than being able to do `pointA + pointB`
  // http://paperjs.org/tutorials/geometry/vector-geometry/#addition-and-subtraction
  var vector = toolEvent.point.subtract(self.startingPoint);
  self.endingPoint = self.startingPoint.add(vector);
  var arrowVector = vector.normalize(15);

  if(self.group){
    self.group.removeChildren();
  } else {
    self.group = new paper.Group();
  }

  self.linePath = new paper.Path([self.startingPoint, self.endingPoint]);
  self.group.addChildren([
    self.linePath,
    new paper.Path([
      self.endingPoint.add(arrowVector.rotate(135)),
      self.endingPoint,
      self.endingPoint.add(arrowVector.rotate(-135))
    ])
  ]);

  self.group.strokeWidth = 5;
  self.group.strokeColor = self.color;
  self.group.strokeCap = "round";
};

DropmarkerArrow.prototype.finalize = function(){
  var self = this;

  self.group.onMouseDown = function(event){
    // Update starting and ending points in case the arrow was moved:
    self.startingPoint = self.linePath.segments[0].point;
    self.endingPoint = self.linePath.segments[1].point;
    if(self.endingPoint.getDistance(event.point) < 20){
      self.DR.create = false;
      self.movingPoint = self.endingPoint;
    }
  };

  self.group.onMouseDrag = function(event){
    if(self.movingPoint){
      self.DR._deselectSelectedItem();
      self.draw(event);
    } else {
      self.DR._moveItem(self.group, event.point);
    }
  };

  self.group.onMouseUp = function(){
    self.movingPoint = null;
    self.DR.create = true;
  };

  self.group.onClick = function(){
    self.DR._toggleSelectedItem(self.linePath);
    self.updateCursor();
  };

  self.group.onMouseEnter = function(){
    self.updateCursor();
  };

  self.group.onMouseLeave = function(){
    self.DR._resetCursor();
  };
};

DropmarkerArrow.prototype.updateCursor = function(){
  if(this.linePath.fullySelected){
    this.DR._setCursor("move");
  } else {
    this.DR._setCursor("pointer");
  }
}