var canvas, ctx;
var activeSequence = 1;
var doAnimate = false;

var sequenceOne = {
    rect:           {width: 20, height: 1},
    type:           {size: 0, spacing: 0},
    circleRadius:   5,
    rotation:       0
  };

var sequenceTwo = {
  circleOne:    0,
  circleTwo:    0,
  circleThree:  0
}

var sequenceThree = {
  x:            0
}

function createAnimationCanvas() {
  canvas = document.createElement('canvas');
  canvas.id = "animationCanvas";
  ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  jQuery('#animationCanvas').append(canvas);
}

var mobileAdd = 0;
function startAnimationSequence() {

  doAnimate = true;
  if (width <= 640) {mobileAdd = 50;}
  sequence_one();
  // sequence_two();
  // sequence_three();
  // activateButtons();
}

function activateButtons() {
  var bBox = width*0.2;
  jQuery('#backgroundBox').css({width: bBox, height: bBox})
  jQuery('#interactiveBox').css({opacity: 1, left: (width-width*0.12)-bBox/2, top: height/2-bBox/2});

  jQuery( ".interactiveDot" ).each(function( index ) {
    jQuery(this).bind(
      "click", buttonClicked
    );
    var rndSize = getRandomInt(20,50);
    jQuery(this).css({width: rndSize, height: rndSize})
  });

  rePositionDots();
}
function rePositionDots() {
  var bBox = width*0.2;
  jQuery( ".interactiveDot" ).each(function( index ) {
    jQuery(this).css({marginTop: getRandomInt(-bBox+100,100), marginLeft: getRandomInt(-50, bBox)});
  });
}


// var doWhat = getRandomInt(0,6);
var imageCount = 12;
var lastState;
var lastInteraction;
var buttonClicks = 0;
function buttonClicked(doWhat) {
  lastInteraction = new Date();
  didReset = false;
  TweenLite.killTweensOf(window);
  TweenLite.killTweensOf(changeAnimation);
  TweenLite.killTweensOf(camPos);

  doWhat = getRandomInt(1,7);

  while (doWhat == lastState) {
    doWhat = getRandomInt(1,7);
  }

  lastState = doWhat;

  rePositionDots();

  // wireframe
  if (doWhat == 2) {
    TweenLite.to(monolith.children[0].children[0].material, 2, {opacity: 0, ease:Expo.easeIn});
    TweenLite.to(backgroundPlane.children[0].material, 2, {opacity: 0, ease:Expo.easeIn});
  } else
  { // change to different texture
    var rndImage = getRandomInt(0,imageCount);
    while (rndImage == activeImage) {
      rndImage = getRandomInt(0,imageCount);
    }
    changeTexture(imagePath+rndImage+'.jpg');
  }


  // text-intro
  if (doWhat == 3 || doWhat == 1) {
    sequenceOne = {
        rect:           {width: 20, height: 1},
        type:           {size: 0, spacing: 0},
        circleRadius:   5,
        rotation:       0
      };
      sequence_one("3");
  }

  if (doWhat == 2) {
    sequence_one("4");
  }

  // circle style
  if (doWhat == 4 || doWhat == 7) {
    sequenceOne = {
        rect:           {width: 20, height: 1},
        type:           {size: 0, spacing: 0},
        circleRadius:   5,
        rotation:       0
      };

      TweenLite.to(sequenceOne.rect, 0, {height: 1, delay:2, ease:Back.easeOut});
      TweenLite.to(sequenceOne.rect, 2, {width: width*0.4+(mobileAdd*3), delay: 2, ease:Back.easeOut});
      TweenLite.to(sequenceOne, 2, {circleRadius: width*0.10+mobileAdd, delay: 2.5, ease:Quad.easeOut});
      TweenLite.to(sequenceOne, 2, {rotation: -45, delay: 2, ease:Back.easeOut});
  }

  // hide additional design elements
  if (doWhat == 5 || doWhat == 6) {
    TweenLite.to(sequenceOne.rect, 2, {width: 0, delay: 2, ease:Back.easeOut});
    TweenLite.to(sequenceOne, 2, {circleRadius: 0.0001, delay: 2, ease:Quad.easeOut});
  }

  if (buttonClicks == 4) {
    var rndImage = getRandomInt(0,imageCount);
    while (rndImage == activeImage) {
      rndImage = getRandomInt(0,imageCount);
    }
    changeTexture(imagePath+rndImage+'.jpg');
    kaleidoActive = true;
  }

  if (doWhat == 6 && buttonClicks > 2) {
    kaleidoActive = true;
  } else {
    kaleidoActive = false;
  }

  buttonClicks++;

}

function sequence_one(initialRun) {
  initialRun = initialRun || "0";
  sequenceOne.type.spacing = (width*0.6)*0.105;
  // width
  TweenLite.to(sequenceOne.rect, 2, {width: width*0.6, delay: 1, ease:Back.easeOut, onComplete: function() {
    // height
    TweenLite.to(sequenceOne.rect, 1, {height: 100, ease:Quad.easeOut});
    // circles
    TweenLite.to(sequenceOne, 2, {circleRadius: width*0.01, ease:Back.easeOut, onComplete: function() {
      TweenLite.to(sequenceOne.rect, 2, {width: 1, delay: 1.5, ease:Expo.easeOut});
      if (initialRun != "4") {
        TweenLite.to(sequenceOne.type, 2, {size: 0, spacing: 0, delay: 1.5, ease:Back.easeOut});
        TweenLite.to(sequenceOne, 2, {rotation: 45, delay: 1.5, ease:Back.easeOut});
        TweenLite.to(sequenceOne, 2, {circleRadius: 4, delay: 1.5, ease:Back.easeOut, onComplete: function() {
          if (initialRun == "0") {
            TweenLite.to(window, 2.16, {data: 0.3, ease:Back.easeIn, onComplete: function() {
              changeTexture(imagePath+activeImage+'.jpg');
            }});

            TweenLite.to(sequenceOne.rect, 0, {height: 1, delay:2, ease:Back.easeOut});
            TweenLite.to(sequenceOne.rect, 2, {width: width*0.4+(mobileAdd*3), delay: 2, ease:Back.easeOut});
            TweenLite.to(sequenceOne, 2, {circleRadius: width*0.10+mobileAdd, delay: 2.5, ease:Quad.easeOut});
            TweenLite.to(sequenceOne, 2, {rotation: -45, delay: 2, ease:Back.easeOut, onComplete: function() {
              sequence_two();
              TweenLite.to(sequenceOne.rect, 2, {width: 0, delay: 2, ease:Back.easeOut});
              TweenLite.to(sequenceOne, 2, {circleRadius: 0.0001, delay: 2, ease:Quad.easeOut});
              TweenLite.to(window, 2, {data: 0.3, ease:Back.easeIn, onComplete: function() {
                doHoverMonolith = true;
              }});
            }});
          }
        }});
      }

    }}); // circles bigger
  }}); // width
  // type
  if (width <= 640) {
    TweenLite.to(sequenceOne.type, 2, {size: width*0.03, ease:Back.easeIn}); // type
  } else {
    TweenLite.to(sequenceOne.type, 2, {size: 30, ease:Back.easeIn}); // type
  }
}

function sequence_two() {
  TweenLite.to(sequenceTwo, 1.8, {circleOne: width*0.13+mobileAdd, delay: 2, ease:Back.easeOut});
  TweenLite.to(sequenceTwo, 1.4, {circleTwo: width*0.1+mobileAdd, delay: 2, ease:Back.easeOut});
  TweenLite.to(sequenceTwo, 1, {circleThree: width*0.07+mobileAdd, delay: 2, ease:Back.easeOut, onComplete: function() {
    addInfoAnimation();
  }});
}

function sequence_three() {
  sequenceThree.x = width/2;
  TweenLite.to(sequenceThree, 1.8, {x: width-width*0.12, ease:Back.easeOut});
  TweenLite.to(sequenceTwo, 1.6, {circleOne: width*0.13+mobileAdd, ease:Back.easeOut});
  TweenLite.to(sequenceTwo, 1.2, {circleTwo: width*0.1+mobileAdd, ease:Back.easeOut});
  TweenLite.to(sequenceTwo, 1, {circleThree: width*0.07+mobileAdd, ease:Back.easeOut, onComplete: function() {

  }});
}


function animateCanvas() {
  if (doAnimate) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth=1;

    var center = {
      x: width/2,
      y: height/2
    }

    // rectangle
    var rectWidth = sequenceOne.rect.width;
    var rectHeight = sequenceOne.rect.height;
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(radians(sequenceOne.rotation));
    ctx.translate(-center.x, -center.y);
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect((center.x-rectWidth/2), (center.y-rectHeight/2), rectWidth, rectHeight);
    ctx.stroke();
    ctx.restore();

    // text
    var monolithText = 'MONOLITH';
    ctx.font = "100 "+sequenceOne.type.size+"px Roboto";
    ctx.fillStyle = '#ffffff';
    for (var i = 0; i < monolithText.length; i++) {
      ctx.fillText(monolithText[i],((center.x-rectWidth/2)+sequenceOne.type.spacing)+(i*sequenceOne.type.spacing), center.y+10);
    }

    // circles
    if (sequenceOne.rotation == 0) {
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(center.x-rectWidth/2,height/2,sequenceOne.circleRadius,0,2*Math.PI);
      ctx.arc(center.x+rectWidth/2,height/2,sequenceOne.circleRadius,0,2*Math.PI);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.lineWidth=1;
      ctx.arc(center.x,height/2,sequenceOne.circleRadius,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth=3;
      ctx.arc(center.x,height/2,sequenceOne.circleRadius+(rectWidth*0.1)*1.15,0,2*Math.PI);
      ctx.stroke();
    }

    // sequence two circles
    var posX = center.x;
    if (sequenceThree.x != 0) {
      posX = sequenceThree.x;
    }
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.arc(posX,center.y,sequenceTwo.circleOne,0,2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.arc(posX,center.y,sequenceTwo.circleTwo,0,2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.arc(posX,center.y,sequenceTwo.circleThree,0,2*Math.PI);
    ctx.fill();


  }
}
