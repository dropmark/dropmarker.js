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

  this.arrow.draw(toolEvent);
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
  this.angle = 0;
};

DropmarkerArrow.prototype.create = function(x, y){
  var self = this;
  self.head = self.createHead();

  self.line = new paper.Path.Line({
    from: [x, y],
    to: [x, y],
    strokeColor: self.color,
    strokeWidth: 5,
    strokeCap: "round",
    fullySelected: false
  });

  self.group = new paper.Group([self.line, self.head]);
};

DropmarkerArrow.prototype.draw = function(toolEvent){
  var self = this;
  var x = toolEvent.point.x;
  var y = toolEvent.point.y;

  if(self.line){
    var segments = self.line.segments;
    var startPoint = segments[0].point;
    var endPoint = segments[1].point;
    var delta = endPoint.subtract(startPoint);

    endPoint.x = x;
    endPoint.y = y;

    // This is kinda hacky, but necessary (?) since Paper.js rotations are incremental.
    // We undo the previous rotation and apply our new rotation afterwards:
    self.head.rotate(self.angle * -1);
    self.head.rotate(delta.angle, toolEvent.point);
    self.angle = delta.angle;
  } else {
    self.create(x, y);
  }

  self.head.position.x = x;
  self.head.position.y = y;

  paper.view.draw();
};

// TODO: Use paper.Symbol for this to save memory:
DropmarkerArrow.prototype.createHead = function (){
  var pathData = "M0.7,3.8c-0.9-0.9-0.9-2.3,0-3.2C1.1,0.2,1.7,0,2.3,0C2.9,0,3.5,0.2,4,0.7l10.6,10.3c0.6,0.6,0.6,1.5,0,2.1L4,23.3 c-0.9,0.9-2.4,0.9-3.3,0s-0.9-2.3,0-3.2L9.1,12L0.7,3.8z";
  var path = new paper.CompoundPath(pathData);
  path.fillColor = this.color;
  return path;
};

DropmarkerArrow.prototype.finalize = function(){
  var self = this;

  self.group.onClick = function(event){
    self.onClick();
  };

  self.group.onMouseEnter = function(){
    self.line.strokeColor = self.DR.hoverColor;
  };

  self.group.onMouseLeave = function(){
    self.line.strokeColor = self.color;
  };
}

DropmarkerArrow.prototype.onClick = function(){
  this.line.fullySelected = true;
}

// DropmarkerArrow.prototype.createAnchors = function(){
//   var self = this;
//   self.line.segments.forEach(function(segment){
//     new DropmarkerAnchor(self.DR, segment.point);
//   });
// };