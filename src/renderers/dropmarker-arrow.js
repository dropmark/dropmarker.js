"use strict";

// -------------------------- ArrowRenderer -------------------------- //

var DropmarkerArrowRenderer = function(dropmarker){
  this.DR = dropmarker;
  this.arrow = null;
};

DropmarkerArrowRenderer.prototype.render = function(x, y){
  if(!this.arrow){
    this.arrow = new DropmarkerArrow(this.DR);
  }

  this.arrow.create(x, y);
};

DropmarkerArrowRenderer.prototype.finalize = function(){
  this.arrow.createAnchors();
  this.arrow = null;
};

// -------------------------- Arrow -------------------------- //

var DropmarkerArrow = function(dropmarker){
  this.DR = dropmarker;
  this.group = null;
  this.line = null;
  this.head = this.createHead();
  this.head.center();
};

DropmarkerArrow.prototype.create = function(pos){
  var self = this;
  var x = pos.x;
  var y = pos.y;
  var angle = pos.angle;

  if(!self.start){
    self.start = { x: x, y: y };
  }

  if(self.line){
    // Remove previous item from scene
    self.group.remove(self.line);
  }

  self.line = self.DR.two.makeLine(self.start.x, self.start.y, x, y);
  self.line.stroke = "rgba(255, 0, 0, 0.85)";
  self.line.linewidth = 5;

  self.head.fill = "rgba(255, 0, 0, 0.85)";
  self.head.translation.set(x, y);
  self.head.rotation = (Math.PI/180) * angle;

  self.group = self.DR.two.makeGroup(self.line, self.head);
  self.DR.two.update();
};

DropmarkerArrow.prototype.createHead = function (){
  var ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns, "svg");
  var path = document.createElementNS(ns, "path");
  path.setAttributeNS(null, "d", "M0.7,3.8c-0.9-0.9-0.9-2.3,0-3.2C1.1,0.2,1.7,0,2.3,0C2.9,0,3.5,0.2,4,0.7l10.6,10.3c0.6,0.6,0.6,1.5,0,2.1L4,23.3 c-0.9,0.9-2.4,0.9-3.3,0s-0.9-2.3,0-3.2L9.1,12L0.7,3.8z");
  svg.appendChild(path);

  var group = this.DR.two.interpret(svg);
  var polygon = null;

  for (var prop in group.children) {
    if( group.children.hasOwnProperty( prop ) ) {
      polygon = group.children[prop];
    }
  }

  return polygon;
}

DropmarkerArrow.prototype.createAnchors = function(){
  var self = this;
  var translation = self.line.translation;

  self.line.vertices.forEach(function(anchor, i){
    new DropmarkerAnchor(self.DR, self.line, anchor);
  });
};