"use strict";

var Dropmarker = function(container){
  this.container = container;
  this.pending = {};
  this.renderer = new DropmarkerArrow(this);
  this.cache = {
    width: this.container.offsetWidth,
    height: this.container.offsetHeight
  };

  // kick things off
  this.create();
};


Dropmarker.prototype.create = function(){
  // Create canvas
  var params = {
    type: Two.Types.canvas,
    width: this.cache.width,
    height: this.cache.height
  };
  this.two = new Two(params).appendTo(this.container);

  // Setup canvas event listeners
  this.activateListeners();

  this.container.classList.add("dropmarker-active");
  this.container.style.position = "relative";
  this.container.style.width = this.cache.width;
  this.container.style.height = this.cache.height;
};

Dropmarker.prototype.activateListeners = function(){
  var self = this;
  var canvas = self.two.renderer.domElement;

  self.bindPanListener(canvas, function(e){
    self.pan(e);
  });

  canvas.addEventListener("mousemove", function(e){
    self.mousemove(e);
  });
};

// Panning (AKA click + drag)
Dropmarker.prototype.bindPanListener = function(element, callback){
  var listener = new Hammer(element, {
    recognizers: [
      [Hammer.Pan,{ direction: Hammer.DIRECTION_ALL }]
    ]
  });

  listener.on("pan", function(e){
    callback(e);
  });
}

// Fired on pan. Most of the good stuff is done in the renderer.
Dropmarker.prototype.pan = function(e){
  var self = this;

  // TODO: Cache container width/height?
  var x = e.center.x - self.container.offsetLeft;
  var y = e.center.y - self.container.offsetTop;

  if(self.pending.item){
    // Remove previous item from scene
    self.two.remove(self.pending.item);
  }

  if(!self.pending.start){
    // Save reference to our starting point
    self.pending.start = { x: x, y: y };
  }

  self.renderer.render(x, y);

  if(e.isFinal){
    self.renderer.finalize();
    self.pending = {};
  }
};

Dropmarker.prototype.mousemove = function(e){
  // console.log(e);
}