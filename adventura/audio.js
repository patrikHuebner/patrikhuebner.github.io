var useMP3 = true;
var fft;
var analyzer;
var mic;
var loaded = false;
var spectrum;
var rms;
var sound;
var audioIsPlaying;

function preload(){
  sound = loadSound('mp3/MikeGao-Adventura96kbps.mp3');
  if (isTouchSupported()) {
    jQuery('#mobileInfo').css({display: 'block'});
  }
  var preLoadImg;
  preLoadImg = loadImage("img/cover.jpg");
  preLoadImg = loadImage("img/env2/negx.jpg");
  preLoadImg = loadImage("img/env2/negy.jpg");
  preLoadImg = loadImage("img/env2/negz.jpg");
  preLoadImg = loadImage("img/env2/posx.jpg");
  preLoadImg = loadImage("img/env2/posy.jpg");
  preLoadImg = loadImage("img/env2/posz.jpg");

  init();
  animate();
  addCueSet();
}

function setup() {
  fft = new p5.FFT(0.9,16);
  analyzer = new p5.Amplitude();
  analyzer.smooth(0.6);
  sound.loop();
  loaded = true;
  jQuery('#preloader').remove();
}

function playPause() {
  if (loaded) {
    sound.pause();
    jQuery('#pauseSpan').html('Play');
    loaded = false;
  } else {
    sound.play();
    jQuery('#pauseSpan').html('Pause');
    loaded = true;
  }
}

var muted = false;
function muteMe() {
  if (!muted) {
    sound.setVolume(0);
    jQuery('#muteSpan').html('Un-mute');
    muted = true;
  } else {
    sound.setVolume(1);
    jQuery('#muteSpan').html('Mute');
    muted = false;
  }
}

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

var light1, light2, light3, light4, light5, light6;
var lightTime = 4.5;
var camPos = {x:0, y:0, z:400, fov: 30};

function addLights() {
  // LIGHTS

  var intensity = 5.5; // 2.5
  var distance = 100; // 100
  var decay = 2.0; // 2.0

  //var c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00, c5 = 0x00ffaa, c6 = 0xff1100;
  var c1 = 0xff6600, c2 = 0xff6600, c3 = 0xff6600, c4 = 0xffffff, c5 = 0xff6600, c6 = 0xff6600;

  var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );

  light1 = new THREE.PointLight( c1, intensity, distance, decay );
  light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
  scene.add( light1 );

  light2 = new THREE.PointLight( c2, intensity, distance, decay );
  light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
  scene.add( light2 );

  light3 = new THREE.PointLight( c3, intensity, distance, decay );
  light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
  scene.add( light3 );

  light4 = new THREE.PointLight( c4, intensity, distance, decay );
  light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
  scene.add( light4 );

  light5 = new THREE.PointLight( c5, intensity, distance, decay );
  light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
  scene.add( light5 );

  light6 = new THREE.PointLight( c6, intensity, distance, decay );
  light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
  scene.add( light6 );
}

function animateLights() {
  //lightTime = Date.now() * 0.00025;
  lightTime+=0.0025;
  var z = 20, d = 150;

  light1.position.x = Math.sin( lightTime * 0.7 ) * d;
  light1.position.y = Math.sin( lightTime * 0.3 ) * d;
  light1.position.z = Math.cos( lightTime * 0.3 ) * d;

  light2.position.x = Math.cos( lightTime * 0.3 ) * d;
  light2.position.y = Math.cos( lightTime * 0.9 ) * d;
  light2.position.z = Math.sin( lightTime * 0.7 ) * d;

  light3.position.x = Math.sin( lightTime * 0.7 ) * d;
  light3.position.y = Math.cos( lightTime * 0.2 ) * d;
  light3.position.z = Math.sin( lightTime * 0.5 ) * d;

  light4.position.x = Math.sin( lightTime * 0.3 ) * d;
  light4.position.z = Math.sin( lightTime * 0.5 ) * d;

  light5.position.x = Math.cos( lightTime * 0.3 ) * d;
  light5.position.z = Math.sin( lightTime * 0.5 ) * d;

  light6.position.x = Math.cos( lightTime * 0.7 ) * d;
  light6.position.z = Math.cos( lightTime * 0.5 ) * d;

  var rms = analyzer.getLevel();
  var lightBoost = 100;
  light4.intensity = rms*lightBoost;
  light4.distance = 100+(rms*lightBoost);

  light1.intensity = rms*lightBoost;
  light1.distance = 100+(rms*lightBoost);
  light2.intensity = rms*lightBoost;
  light2.distance = 100+(rms*lightBoost);
  light3.intensity = rms*lightBoost;
  light3.distance = 100+(rms*lightBoost);
  light5.intensity = rms*lightBoost;
  light5.distance = 100+(rms*lightBoost);
  light6.intensity = rms*lightBoost;
  light6.distance = 100+(rms*lightBoost);
}

function followLights() {
  camera.position.set(light6.position.x,Math.abs(Math.sin( lightTime * 0.5 )*100),light6.position.z);
}

function animateCamTo() {
  camera.position.set(camPos.x,camPos.y,camPos.z);
  camera.fov = camPos.fov;
  camera.lookAt( scene.position );
  camera.updateProjectionMatrix();
}

var container;

var camera, scene, renderer;
var glitchPass;
var container;

var JSmouseX = 0, JSmouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var delta;
var clock = new THREE.Clock();
var stats;

var textureCube, envMesh;
var objectCopy, mainObject;


function init() {

  //container = document.createElement( 'div' );
  container = document.getElementById( 'canvasID' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 450;

  // scene

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight( 0x101030 );
  scene.add( ambient );

  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 );
  scene.add( directionalLight );

  // envMap

  var path = "img/env2/";
  var format = '.jpg';
  var urls = [
      path + 'posx' + format, path + 'negx' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posz' + format, path + 'negz' + format
    ];
  textureCube = new THREE.CubeTextureLoader().load( urls );
  textureCube.format = THREE.RGBFormat;

  // texture

  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {

    //console.log( item, loaded, total );

  };

  var texture = new THREE.Texture();

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      //console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) {
  };


  var loader = new THREE.ImageLoader( manager );
  loader.load( 'img/solidTexture.png', function ( image ) {
  //loader.load( 'img/02.jpg', function ( image ) {

    texture.image = image;
    texture.needsUpdate = true;

  } );

  // model

  var refMaterial = new THREE.MeshPhongMaterial( {
    specular:       0x191919,
    color:          0xffffff,
    //map:            texture,
    shininess:      100,
    reflectivity:   1.2,
    envMap:         textureCube
  });

  var envMaterial = new THREE.MeshPhongMaterial( {
    specular:       0x191919,
    //color:          0x191919,
    map:            texture,
    //shading:        THREE.FlatShading,
    shininess:      1,
    reflectivity:   0.2,
    envMap:         textureCube,
    combine:        THREE.MixOperation,
    blending:       THREE.AdditiveBlending
  });

  var loader = new THREE.OBJLoader( manager );
  var loadObject = 'obj/BanzBowinkel.obj';
  //var loadObject = 'obj/JulienSimshauser.obj';
  loader.load( loadObject, function ( object ) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material = refMaterial;
        child.material.map = texture;
      }
    } );

    object.name = 'sceneObject';
    object.position.y = - 125;
    object.position.z = - 120;
    scene.add( object );
    object.visible = false;

  }, onProgress, onError );

  loader.load( loadObject, function ( object ) {

    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material = refMaterial;
        child.material.map = texture;
      }
    } );

    object.name = 'copiedSceneObject';
    object.position.y = - 125;
    object.position.z = - 120;
    objectCopy = object;

  }, onProgress, onError );


  // environment

  var geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );

  envMesh = new THREE.Mesh( geometry, envMaterial );
  scene.add( envMesh );
  envMesh.visible = false;

  //

  //renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true, antialias: false } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );
  //renderer.autoClearColor = false;

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  // stats
  stats = new Stats();
  statsDIV.appendChild( stats.dom );

  //

  window.addEventListener( 'resize', onWindowResize, false );

  // create 2D animation-elements
  createCanvasElements();

  // addLights
  addLights();

  jQuery('#preloader').remove();
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {

  JSmouseX = ( event.clientX - windowHalfX ) / 2;
  JSmouseY = ( event.clientY - windowHalfY ) / 2;

}

function onDocumentTouchStart( event ) {
  JSmouseX = event.touches[ 0 ].pageX - windowHalfX;
  JSmouseY = 0;
  /*
  if ( event.touches.length === 1 ) {
    //event.preventDefault();
    mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
  */

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length === 1 ) {
    //event.preventDefault();
    //mouseX = event.touches[ 0 ].pageX - windowHalfX;
    //targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    JSmouseX = event.touches[ 0 ].pageX - windowHalfX;
    JSmouseY = 0;

  }

}

//

function animate() {

  requestAnimationFrame( animate );
  if (rms > 0.01 && !audioIsPlaying) {
    audioIsPlaying = true;
    jQuery('#mobileInfo').remove();
  }

  if (loaded == true) {
    spectrum = fft.analyze();
    rms = analyzer.getLevel();
    if (audioIsPlaying) {
      render();
    }
    stats.update();
  }

}

var myScale = 1;
var deltaA = 0;
function render() {
  deltaA+=0.001;
  delta = clock.getDelta();

  animateCanvasLineAnimation();
  if (animateForeground) {
    animateCircles();
  }

  if (animateLight) {
    animateLights();
  }

  if (followLight) {
    followLights();
  }

  if (mainObject == undefined)
    mainObject = scene.getObjectByName( "sceneObject", true );

  if (scaleObject) {
    //myScale = Math.sin(deltaA);
    myScale = Math.cos(deltaA);
    if (mainObject != undefined) {
      mainObject.scale.x = myScale;
      mainObject.scale.y = myScale;
      mainObject.scale.z = myScale;
    }
  }

  if (rotateObjectSmooth) {
    mainObject.rotation.y += 0.005;
  }

  if (objectRotation) {
    if (mainObject != undefined) {
      if (rms > 0.4) {
        mainObject.rotation.x += rms*0.01;
        mainObject.rotation.y += rms*0.01;
        mainObject.rotation.z += rms*0.01;
      }
    }
  }

  var e = 0;
  var maxE = spectrum.length-1;

  if (deformMesh) {
    for (var i = 0; i < mainObject.children.length; i++) {
      for (var j = 0; j < mainObject.children[i].geometry.attributes.position.array.length; j++) {
        if (j%moduloDeform == moduloTarget) {
          mainObject.children[i].geometry.attributes.position.array[j] = (objectCopy.children[i].geometry.attributes.position.array[j]) + (spectrum[e]*boostDeform)+0.000001;
          mainObject.children[i].geometry.attributes.position.needsUpdate = true;
          if (e < maxE)
            e++;
          else
            e = 0;
        }
      }
    }
  }

  scene.position.x += ( JSmouseX - scene.position.x ) * .05;
  scene.position.y += ( - JSmouseY - scene.position.y ) * .05;
  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}




function isTouchSupported() {
  var msTouchEnabled = window.navigator.msMaxTouchPoints;
  var generalTouchEnabled = "ontouchstart" in document.createElement("div");

  if (msTouchEnabled || generalTouchEnabled) {
      return true;
  }
  return false;
}
var boostDeform = 0.1;
var moduloDeform = 120;
var moduloTarget = 0;

var animateLight = true;
var animateForeground = false;
var animateRandomCharacters = false;
var followLight = false;
var scaleObject = false;
var deformMesh = false;
var objectRotation = false;
var rotateObjectSmooth = false;

function addCueSet() {

  sound.addCue(2.01, function() {
    camPos.z = 200;
    animateCamTo();
    jQuery('#canvasOverlaySpan').html('G');
  });
  sound.addCue(2.74, function() {
    camPos.z = 900;
    animateCamTo();
    jQuery('#canvasOverlaySpan').html('A');
  });

  sound.addCue(2.98, function() {
    camPos.z = 450;
    animateCamTo();
    jQuery('#canvasOverlaySpan').html('O');
  });

  sound.addCue(3.5, function() {
    jQuery('#canvasOverlaySpan').html('');
  });


  sound.addCue(7.5, function() {
    TweenLite.to(camPos, 7.7, {x:0, y:0, z:0, fov:145, ease:Quad.easeIn, onUpdate:animateCamTo});
  });

  sound.addCue(15.54, function() {
    showObject();
    moduloDeform = 50;
    deformMesh = true;
    TweenLite.to(camPos, 2, {x:0, y:0, z:450, fov:45, ease:Quad.easeOut, onUpdate:animateCamTo});
  });

  sound.addCue(17.72, function() {
    jQuery('#canvasOverlaySpan').html('G');
    camPos.z = 700;
    animateCamTo();
  });
  sound.addCue(17.96, function() {
    jQuery('#canvasOverlaySpan').html('A');
    camPos.z = 900;
    animateCamTo();
  });

  sound.addCue(18.45, function() {
    jQuery('#canvasOverlaySpan').html('O');
    camPos.z = 450;
    animateCamTo();
  });

  sound.addCue(19.42, function() {
    jQuery('#canvasOverlaySpan').html('');
    camPos.z = 350;
    animateCamTo();
  });
  sound.addCue(19.9, function() {
    camPos.z = 250;
    animateCamTo();
  });
  sound.addCue(20.14, function() {
    camPos.z = 150;
    animateCamTo();
  });
  sound.addCue(21.83, function() {
    camPos.z = 250;
    animateCamTo();
  });
  sound.addCue(21.99, function() {
    camPos.z = 350;
    animateCamTo();
  });
  sound.addCue(22.32, function() {
    camPos.z = 450;
    animateCamTo();
  });

  sound.addCue(23.29, function() {
    renderer.autoClearColor = false;
    rotateObjectSmooth = true;
    animateForeground = true;
    animateRandomCharacters = true;
    boostDeform = 0.7;
    moduloDeform = 60;
    TweenLite.to(camPos, 6, {x:300, y:200, z:150, fov:245, ease:Quad.easeOut, onUpdate:animateCamTo});
  });

  sound.addCue(31.03, function() {
    renderer.autoClearColor = true;
    animateForeground = false;
    animateRandomCharacters = false;
    context3.clearRect(0, 0, canvasObjectAnimation.width, canvasObjectAnimation.height);
    texture3.needsUpdate = true;
    moduloDeform = 20;
    TweenLite.to(camPos, 2, {x:0, y:0, z:450, fov:45, ease:Quad.easeOut, onUpdate:animateCamTo});
    objectRotation = true;
    rotateObjectSmooth = false;
  });

  sound.addCue(35.63, function() {
    camPos.z = 200;
    animateCamTo();
  });
  sound.addCue(35.75, function() {
    camPos.z = 900;
    animateCamTo();
  });

  sound.addCue(35.87, function() {
    camPos.z = 450;
    animateCamTo();
    rotateObjectSmooth = true;
  });


  sound.addCue(38.77, function() {
    jQuery('#canvasOverlaySpan').html('G');
  });
  sound.addCue(40.95, function() {
    jQuery('#canvasOverlaySpan').html('A');
  });
  sound.addCue(41.19, function() {
    jQuery('#canvasOverlaySpan').html('O');
  });
  sound.addCue(41.67, function() {
    jQuery('#canvasOverlaySpan').html('');
  });

  sound.addCue(46.53, function() {
    rotateObjectSmooth = false;
    boostDeform = 0.1;
    followLight = true;
    renderer.autoClearColor = false;
  });
  sound.addCue(54, function() { //54.26
    renderer.autoClearColor = true;
    objectRotation = false;
    followLight = false;
    hideObject();
    showEnv();
    TweenLite.to(camPos, 5, {x:0, y:0, z:650, fov:100, ease:Quad.easeOut, onUpdate:animateCamTo});
  });

  sound.addCue(61.99, function() {
    showObject();
    moduloDeform = 50;
    deformMesh = true;
    TweenLite.to(camPos, 2, {x:0, y:0, z:450, fov:45, ease:Quad.easeOut, onUpdate:animateCamTo});
    animateForeground = true;
    rotateObjectSmooth = true;
    objectRotation = true;
  });
  sound.addCue(65.87, function() {
    animateRandomCharacters = true;
  });

  sound.addCue(68.29, function() {
    camPos.z = 350;
    animateCamTo();
  });
  sound.addCue(68.45, function() {
    camPos.z = 250;
    animateCamTo();
  });
  sound.addCue(68.77, function() {
    camPos.z = 150;
    animateCamTo();
  });


  sound.addCue(69.74, function() {
    animateForeground = false;
    objectRotation = false;
    context3.clearRect(0, 0, canvasObjectAnimation.width, canvasObjectAnimation.height);
    texture3.needsUpdate = true;
    camPos.z = 700;
    animateCamTo();
    jQuery('#canvasOverlaySpan').html('G');
  });
  sound.addCue(69.86, function() {
    jQuery('#canvasOverlaySpan').html('A');
    camPos.z = 900;
    animateCamTo();
  });

  sound.addCue(69.99, function() {
    jQuery('#canvasOverlaySpan').html('O');
    camPos.z = 450;
    animateCamTo();
  });
  sound.addCue(70.4, function() {
    jQuery('#canvasOverlaySpan').html('');
  });

  sound.addCue(73.58, function() {
    jQuery('#canvasOverlaySpan').html('');
    camPos.z = 250;
    animateCamTo();
  });
  sound.addCue(75.69, function() {
    camPos.z = 450;
    animateCamTo();
  });


  sound.addCue(77.48, function() {
    boostDeform = 2.7;
    moduloDeform = 200;
    TweenLite.to(camPos, 3, {x:300, y:200, z:150, fov:245, ease:Quad.easeIn, onUpdate:animateCamTo});
  });
  sound.addCue(81.35, function() {
    boostDeform = 2.7;
    moduloDeform = 200;
    TweenLite.to(camPos, 10, {x:0, y:0, z:450, fov:45, ease:Quad.easeOut, onUpdate:animateCamTo});
  });

  sound.addCue(82.8, function() {
    jQuery('#canvasOverlaySpan').html('G');
  });
  sound.addCue(82.93, function() {
    jQuery('#canvasOverlaySpan').html('A');
  });
  sound.addCue(83.52, function() {
    jQuery('#canvasOverlaySpan').html('O');
  });
  sound.addCue(83.77, function() {
    jQuery('#canvasOverlaySpan').html('');
  });


  sound.addCue(92.94, function() {
    followLight = true;
    hideEnv();
    renderer.autoClearColor = false;
  });

  sound.addCue(127, function() {
    renderer.autoClearColor = true;
    hideObject();
    boostDeform = 0.1;
    moduloDeform = 120;
    moduloTarget = 0;

    animateLight = true;
    animateForeground = false;
    animateRandomCharacters = false;
    followLight = false;
    scaleObject = false;
    deformMesh = false;
    objectRotation = false;
    rotateObjectSmooth = false;
  });

  sound.addCue(128, function() {
    TweenLite.to(camPos, 0.5, {x:0, y:0, z:450, fov:45, ease:Quad.easeOut, onUpdate:animateCamTo});
  });



}

function hideEnv() {
  envMesh.visible = false;
}

function showEnv() {
  envMesh.visible = true;
}

function hideObject() {
  mainObject.visible = false;
}

function showObject() {
  mainObject.visible = true;
}
