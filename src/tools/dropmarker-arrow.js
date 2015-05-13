"use strict";

// -------------------------- ArrowRenderer -------------------------- //

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
  }

  self.tool.onMouseUp = function(){
    self.onMouseUp();
  };
};

DropmarkerArrowTool.prototype.activate = function(){
  this.tool.activate();
}

DropmarkerArrowTool.prototype.onMouseDrag = function(toolEvent){

  if(!this.arrow){
    this.arrow = new DropmarkerArrow(this.DR);
  }

  this.arrow.draw(toolEvent, this.startingPoint);
};

DropmarkerArrowTool.prototype.onMouseUp = function(){
  if(this.arrow){
    this.arrow.finalize();
    this.arrow = null;
  }
};

// -------------------------- Arrow -------------------------- //

var DropmarkerArrow = function(dropmarker){
  this.DR = dropmarker;
  this.color = this.DR.color;
};

DropmarkerArrow.prototype.draw = function(toolEvent, startingPoint){
  var self = this;

  // Since we're using paper-core, we need to use the `pointA.subtract` and `pointA.add`
  // methods rather than being able to do `pointA + pointB`
  // http://paperjs.org/tutorials/geometry/vector-geometry/#addition-and-subtraction
  var vector = toolEvent.point.subtract(startingPoint);
  var endingPoint = startingPoint.add(vector);
  var arrowVector = vector.normalize(15);

  if(self.group){
    self.group.remove();
  }

  self.group = new paper.Group([
    new paper.Path([startingPoint, endingPoint]),
    new paper.Path([
      endingPoint.add(arrowVector.rotate(135)),
      endingPoint,
      endingPoint.add(arrowVector.rotate(-135))
    ])
  ]);

  self.group.strokeWidth = 5;
  self.group.strokeColor = self.color;
  self.group.strokeCap = "round"

  paper.view.draw();
};

DropmarkerArrow.prototype.finalize = function(){
  var self = this;

  self.group.onClick = function(event){
    self.onClick();
  };

  self.group.onMouseEnter = function(){
    self.group.strokeColor = self.DR.hoverColor;
  };

  self.group.onMouseLeave = function(){
    self.group.strokeColor = self.color;
  };
}

DropmarkerArrow.prototype.onClick = function(){
  this.group.fullySelected = !this.group.fullySelected;
};