"use strict";

var DropmarkerArrow = function(dropmarker){
  this.DR = dropmarker;
  this.id = "arrow";
};

DropmarkerArrow.prototype.render = function(x, y){
  var self = this;
  var polygon = self.DR.two.makeLine(self.DR.pending.start.x, self.DR.pending.start.y, x, y);
  polygon.stroke = "rgba(255, 0, 0, 0.85)";
  polygon.linewidth = 5;
  self.DR.pending.item = polygon;
  self.DR.two.update();
};

DropmarkerArrow.prototype.finalize = function(){
  var self = this;
  var polygon = self.DR.pending.item;
  var translation = polygon.translation;

  polygon.vertices.forEach(function(anchor, i){
    var x = anchor.x + translation.x;
    var y = anchor.y + translation.y;
    var drAnchor = new DropmarkerAnchor(self.DR, x, y, polygon.id, i);
    self.initAnchor(drAnchor.element, anchor);
  });
};

DropmarkerArrow.prototype.initAnchor = function(el, anchor){
  var self = this;
  console.log(anchor);

  // AKA: Click and drag
  self.DR.bindPanListener(el, function(e){
    var x = e.center.x - self.DR.container.offsetLeft;
    var y = e.center.y - self.DR.container.offsetTop;
    self.panAnchor(x, y, el, anchor);
  });
};

DropmarkerArrow.prototype.panAnchor = function(x, y, el, anchor){
  el.style.left = x + "px";
  el.style.top = y + "px";
  anchor.x = x;
  anchor.y = y;
  this.DR.two.update();
};