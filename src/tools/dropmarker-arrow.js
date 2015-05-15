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
  this.DR._setCursor('crosshair');
  console.log('DropmarkerArrowTool activate');
  console.log("Create: " + this.DR.create);
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
  var arrowVector = vector.normalize(3 * self.DR.pathSize);

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

  self.group.strokeWidth = self.DR.pathSize;
  self.group.strokeColor = self.color;
  self.group.strokeCap = "round";
};

DropmarkerArrow.prototype.finalize = function(){
  var self = this;

  self.group.onMouseDown = function(event){
    if(!self.DR.selectMode) return;

    self.DR._deselectSelectedItem();

    // Update starting and ending points in case the arrow was moved:
    self.startingPoint = self.linePath.segments[0].point;
    self.endingPoint = self.linePath.segments[1].point;
    if(self.endingPoint.getDistance(event.point) < 20){
      self.DR.create = false;
      self.movingPoint = self.endingPoint;
    } else {
      // Only select the item if we're not changing its head position
      // (otherwise Paper throws an error)
      self.DR._selectItem(self.group);
    }
  };

  self.group.onMouseDrag = function(event){
    if(!self.DR.selectMode) return;

    if(self.movingPoint){
      self.draw(event);
    } else {
      self.DR._moveItem(self.group, event.point);
    }
  };

  self.group.onMouseUp = function(){
    if(!self.DR.selectMode) return;
    self.DR._selectItem(self.group);
    self.movingPoint = null;
    self.DR.create = true;
  };

  self.group.onClick = function(){
    if(!self.DR.selectMode) return;
    self.updateCursor();
  };

  self.group.onMouseEnter = function(){
    if(!self.DR.selectMode) return;
    self.updateCursor();
  };

  self.group.onMouseLeave = function(){
    if(!self.DR.selectMode) return;
    self.DR._resetCursor();
  };
};

DropmarkerArrow.prototype.updateCursor = function(){
  if(this.group.fullySelected){
    this.DR._setCursor("move");
  } else {
    this.DR._setCursor("pointer");
  }
}
