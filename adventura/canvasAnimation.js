var canvasLineAnimation, canvasTextAnimation, canvasObjectAnimation;
var material1, texture1, context1;
var material2, texture2, context2;
var material3, texture3, context3;
var maxAnisotropy;
var myLines = [
  "MIKE GAO",
  "WHITE STONE",
  "ADV ENT URA",
  "WEB GL"
]
var curLine = 0;

function createCanvasElements() {
  maxAnisotropy = renderer.getMaxAnisotropy();

  // CONTEXT1
  canvasLineAnimation = document.createElement('canvas');
  context1 = canvasLineAnimation.getContext('2d');
  texture1 = new THREE.Texture(canvasLineAnimation)
  texture1.minFilter = THREE.LinearFilter; // get rid of the "power of two" notice
  texture1.anisotropy = maxAnisotropy;
  texture1.needsUpdate = true;
  material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
  material1.transparent = true;
  var mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasLineAnimation.width, canvasLineAnimation.height),
    material1
  );
  mesh1.position.set(0,0,0);
  scene.add( mesh1 );
  canvasLineAnimation.width *= 3;
  canvasLineAnimation.height *= 3;

  // CONTEXT2
  canvasTextAnimation = document.createElement('canvas');
  context2 = canvasTextAnimation.getContext('2d');
  texture2 = new THREE.Texture(canvasTextAnimation)
  texture2.minFilter = THREE.LinearFilter; // get rid of the "power of two" notice
  texture2.anisotropy = maxAnisotropy;
  texture2.needsUpdate = true;
  material2 = new THREE.MeshBasicMaterial( {map: texture2, side:THREE.DoubleSide } );
  material2.transparent = true;
  var mesh2 = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasTextAnimation.width, canvasTextAnimation.height),
    material2
  );
  mesh2.position.set(0,0,30);
  scene.add( mesh2 );
  canvasTextAnimation.width *= 3;
  canvasTextAnimation.height *= 3;

  Speak(myLines[curLine]);

  // CONTEXT3
  canvasObjectAnimation = document.createElement('canvas');
  context3 = canvasObjectAnimation.getContext('2d');
  texture3 = new THREE.Texture(canvasObjectAnimation)
  texture3.minFilter = THREE.LinearFilter; // get rid of the "power of two" notice
  texture3.anisotropy = maxAnisotropy;
  texture3.needsUpdate = true;
  material3 = new THREE.MeshBasicMaterial( {map: texture3, side:THREE.DoubleSide } );
  material3.transparent = true;
  var mesh3 = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasObjectAnimation.width*4,canvasObjectAnimation.height*4),
    material3
  );
  mesh3.position.set(0,0,-50);
  scene.add( mesh3 );
  canvasObjectAnimation.width *= 3;
  canvasObjectAnimation.height *= 3;
}

var tickCharacter = 0;
function animateCanvasLineAnimation() {
  var e = 0;
  var maxE = spectrum.length;

  tickCharacter++;
  context1.clearRect(0, 0, canvasLineAnimation.width, canvasLineAnimation.height);
  context2.clearRect(0, 0, canvasTextAnimation.width, canvasTextAnimation.height);

  // --
  // CONTEXT 2

  // BOX
  context2.strokeStyle = "#ffffff";
  var rectW = 150, rectH = 150;
  context2.strokeRect((canvasTextAnimation.width-rectW)/2,(canvasTextAnimation.height-rectH)/2,rectW,rectH);

  // TEXT
  var maxWidth = 110;
  var lineHeight = 45;
  var x = (canvasTextAnimation.width - maxWidth) / 2;
  var y = 210;

  text = curText;
  if (tickCharacter %20 > 10)
    text+="_";

  context2.font = "Bold 35px Arial";
  context2.fillStyle = '#ffffff';
  wrapText(context2, text, x, y, maxWidth, lineHeight);

  // --
  // CONTEXT 1

  context1.lineWidth =2;
  context1.save();

  context1.rotate(delta*Math.PI/180);
  context1.strokeStyle = "#ffffff";
  var rectW = 150, rectH = 150;
  context1.strokeRect((canvasTextAnimation.width-rectW)/2,(canvasTextAnimation.height-rectH)/2,rectW,rectH);

  context1.restore();


  // CIRCLES
  var centerX = canvasLineAnimation.width / 2;
  var centerY = canvasLineAnimation.height / 2;

  context1.strokeStyle = '#8d8384';

  //context1.lineWidth = Math.sin(deltaA*20)*1*(rms*20);
  context1.lineWidth = (rms*20);
  context1.beginPath();
  context1.arc(centerX+JSmouseX*0.1, centerY+JSmouseY*0.1, 150, 0, 2 * Math.PI, false);
  context1.stroke();

  context1.strokeStyle = '#ff6600';
  //context1.lineWidth = Math.cos(deltaA*20)*2;
  context1.lineWidth = (rms*40);
  context1.beginPath();
  context1.arc(centerX+JSmouseX*0.01, centerY+JSmouseY*0.01, 200, 0, 2 * Math.PI, false);
  context1.stroke();

  context1.strokeStyle = '#8d8384';

  //context1.lineWidth = Math.sin(deltaA*20)*3;
  context1.lineWidth = (rms*60);
  context1.beginPath();
  context1.arc(centerX+JSmouseX*0.2, centerY+JSmouseY*0.2, 350, 0, 2 * Math.PI, false);
  context1.stroke();

  //context1.lineWidth = Math.cos(deltaA*20)*4;
  context1.lineWidth = (rms*80);
  context1.beginPath();
  context1.arc(centerX+JSmouseX*0.1, centerY+JSmouseY*0.1, 450, 0, 2 * Math.PI, false);
  context1.stroke();

  // UPDATE TEXTURE

  texture1.needsUpdate = true;
  texture2.needsUpdate = true;
}


function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context2.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context2.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }

  context2.fillText(line, x, y);
}



var myTimer, fullText, currentOffset, onCompleteText;
var curText = "";

function Speak(text, textCallback) {
  fullText = text;
  currentOffset = 0;
  //onCompleteText = textCallback;
  /*
  onCompleteText = function() {
    Speak("GO/ HERE",
    function () {
      setTimeout(function(){
        Speak("NOW/ NEVER");
      }, 4000);
    });
  }
  */
  myTimer = setInterval(onTick, 480);
}

function onTick() {
  currentOffset++;
  if (currentOffset == fullText.length) {
    complete();
    return;
  }
  var text = fullText.substring(0, currentOffset);
  curText = text;
}

function complete() {
  clearInterval(myTimer);
  myTimer = null;
  curText = fullText;
  //onCompleteText();
  if (curLine < myLines.length-1)
    curLine++;
  else
    curLine = 0;

  Speak(myLines[curLine]);

}


var blocks = [];
function animateCircles() {
  context3.clearRect(0, 0, canvasObjectAnimation.width, canvasObjectAnimation.height);
  if (rms > 0.5) {
    var loc = createVector(random(canvasObjectAnimation.width), random(canvasObjectAnimation.height));
    myBlock = new Block(loc);
    blocks.push(myBlock);
  }

  for (var i = 0; i < blocks.length; i++) {
    myBlock = blocks[i];
    myBlock.run(i);
  }
  texture3.needsUpdate = true;
}


function getChar(maxCount)
{
    var text = "";
    var possible = "GAO";

    for( var i=0; i < maxCount; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function Block(loc) {
  this.loc = loc;
  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.style = random(0,1);
  this.myColor = '#fff';
  if (this.style < 0.2) {
    this.myColor = '#ff6600';
  }
  //this.myText = getChar(random(1,2));
  this.myText = getChar(1);

  this.acc = createVector(-rms,rms);

  if (rms > 0.4)
    this.lifeSpan = Math.floor(rms*200);
  else
    this.lifeSpan = 50;

  this.run = function(i) {
      if (this.lifeSpan > 0)
        this.lifeSpan--;
      else
        blocks.splice(i, 1);

      this.checkBoundaries();
      this.move();
      this.draw();
    },

    this.checkBoundaries = function() {
      if (this.loc.x < 0 || this.loc.x > width)
        this.vel.x *= -1;

      if (this.loc.y < 0 || this.loc.y > height)
        this.vel.y *= -1;
    },

    this.move = function() {
      this.vel.add(this.acc);
      this.loc.add(this.vel);
    }


  this.draw = function() {
    if (animateRandomCharacters) {
      context3.font = "Bold "+this.lifeSpan+"px Arial";
      context3.fillStyle = this.myColor;
      context3.fillText(this.myText, this.loc.x, this.loc.y);
    } else {
      context3.beginPath();
      context3.arc(this.loc.x, this.loc.y, this.lifeSpan, 0, 2 * Math.PI, false);
      if (this.style < 0.5) {
        context3.fillStyle = this.myColor;
        context3.fill();
      } else {
        context3.lineWidth = 2;
        context3.strokeStyle = this.myColor;
        context3.stroke();
      }
      context3.stroke();
    }
  }

}
