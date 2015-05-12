var DropmarkerAnchor = function(dropmarker, x, y, polygonId, anchorId){
  this.DR = dropmarker;
  this.x = x;
  this.y = y;
  this.polygonId = polygonId;
  this.anchorId = anchorId;

  this.create();
};

DropmarkerAnchor.prototype.create = function(){
  this.element = document.createElement("span");
  this.element.classList.add("dropmarker-anchor");
  this.element.setAttribute("data-anchor", this.anchorId);
  this.element.setAttribute("data-polygon", this.polygonId);
  this.element.style.left = this.x + "px";
  this.element.style.top = this.y + "px";
  this.DR.container.appendChild(this.element);
  return this.element;
};

DropmarkerAnchor.prototype.activateEvents = function(){
  var self = this;
  self.DR.bindPanListener(self.element, function(e){
    var x = e.center.x - self.DR.container.offsetLeft;
    var y = e.center.y - self.DR.container.offsetTop;
    self.panAnchor(x, y, el, anchor);
  });
}