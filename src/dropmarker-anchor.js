var DropmarkerAnchor = function(dropmarker, point){
  this.DR = dropmarker;
  this.element = null;
  this.point = point;
  this.create();
};

DropmarkerAnchor.prototype.create = function(){
  var x = this.point.x;
  var y = this.point.y;

  this.element = document.createElement("span");
  this.element.classList.add("dropmarker-anchor");
  // this.element.setAttribute("data-anchor", this.anchorId);
  // this.element.setAttribute("data-polygon", this.polygon.id);
  this.element.style.left = x + "px";
  this.element.style.top = y + "px";
  this.DR.container.appendChild(this.element);
  this.activateEvents();
};

DropmarkerAnchor.prototype.activateEvents = function(){
  var self = this;
  // self.DR.bindDragListener(self.element, function(e){
  //   var x = e.center.x - self.DR.container.offsetLeft;
  //   var y = e.center.y - self.DR.container.offsetTop;
  //   self.pan(x, y);
  // });
}

DropmarkerAnchor.prototype.pan = function(x, y){
  this.element.style.left = x + "px";
  this.element.style.top = y + "px";
  this.anchor.x = x - this.polygon.translation.x;
  this.anchor.y = y - this.polygon.translation.y;
  this.DR.two.update();
}