"use strict";

var Dropmarker = function(container){
  this.container = container;
  this.renderer = new DropmarkerArrowRenderer(this);
  this.cache = {
    width: this.container.offsetWidth,
    height: this.container.offsetHeight
  };

  // kick things off
  this.create();
};


Dropmarker.prototype.create = function(){
  // Create canvas
  this.canvas = document.createElement('canvas');
  this.canvas.style.width = this.cache.width + 'px';
  this.canvas.style.height = this.cache.height + 'px';
  this.container.appendChild(this.canvas);

  // Create a Paper project
  paper.setup(this.canvas);

  // Setup canvas event listeners
  this.activateListeners();

  this.container.classList.add("dropmarker-active");
  this.container.style.position = "relative";
  this.container.style.width = this.cache.width;
  this.container.style.height = this.cache.height;
};

Dropmarker.prototype.activateListeners = function(){
  var self = this;



  // self.bindDragListener(canvas, function(e){
  //   self.pan(e);
  // });

  // canvas.addEventListener("mousemove", function(e){
  //   self.mousemove(e);
  // });
};

Dropmarker.prototype.bindDragListener = function(element, callback){
  var listener = new Hammer(element, {
    recognizers: [
      [Hammer.Pan, {
          direction: Hammer.DIRECTION_ALL,
          threshold: 3
        }
      ]
    ]
  });

  listener.on("pan", function(e){
    callback(e);
  });
}

// Fired on pan. Most of the good stuff is done in the renderer.
Dropmarker.prototype.pan = function(e){
  var self = this;

  // console.log(e);

  // console.log(self.container.offsetTop);
  console.log(e.center.y);


  // TODO: Cache container width/height?
  var pos = {
    x: e.center.x - self.container.offsetLeft,
    y: e.center.y - self.container.offsetTop,
    angle: e.angle
  };

  self.renderer.render(pos);

  if(e.isFinal){
    self.renderer.finalize();
  }
};

Dropmarker.prototype.mousemove = function(e){
  // console.log(e);
};