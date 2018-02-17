if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, objects;
var orbitControls;
var req;
var doAntialias = true;
var doShadows = false;
var camPos = {x:0, y:1, z:8, fov: 40};
var keepControlsAboveGround = false;
var monolith;

var imagePath = 'images/';
var activeImage = 12;
var kaleidoParams, kaleidoPass;
var composer;
var kaleidoSettings = {sides: 24, angle: 2};
var doHoverMonolith = false;

var highDPI = true;
var reduceResolution = false;
var canvasScale = 1;

var showPerformance = false;
var lowPerformance = 0;
var firstClick = false;

var kaleidoActive = false;

window.onload = init;

// -- SETUP
// ---------------------------------------------
function init() {
  jQuery( document ).on( "mousemove", function( event ) {
    if (scene!=undefined) {
      kaleidoSettings.sides = map(event.pageX,0,width,1,24);
      kaleidoSettings.angle = map(event.pageY,0,height,0,2);
      kaleidoPass.uniforms[ "sides" ].value = kaleidoSettings.sides; // 0 - 24
      kaleidoPass.uniforms[ "angle" ].value = kaleidoSettings.angle*3.1416;  // 0.0 - 2.0
    }
  });

  // stats
  stats = new Stats();
  document.getElementById("Stats-output").appendChild(stats.dom);
  if (showPerformance) {
    jQuery('#Stats-output div').css({display:'block'});
  } else {
    jQuery('#Stats-output div').css({display:'none'});
  }

  // renderer
  renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true, antialias: doAntialias } );
  renderer.setClearColor( 0xbfbfbf );
  if (highDPI) {renderer.setPixelRatio( window.devicePixelRatio );}
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = 'threeWebGL';
  renderer.toneMapping = THREE.LinearToneMapping;
  if (doShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  document.getElementById("WebGL-output").appendChild(renderer.domElement);
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( camPos.x, camPos.y, camPos.z );
  camera.fov = camPos.fov;

  // controls
  orbitControls = new THREE.OrbitControls(camera,renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.1;
  orbitControls.minDistance = 3;
  orbitControls.maxDistance = 20;
  orbitControls.enablePan = false;

  // prevent controls from going beyond the ground
  if (keepControlsAboveGround) {
    var centerPosition = orbitControls.target.clone();
    centerPosition.y = 0;
    var groundPosition = camera.position.clone();
    groundPosition.y = 0;
    var d = (centerPosition.distanceTo(groundPosition));
    var origin = new THREE.Vector2(orbitControls.target.y,0);
    var remote = new THREE.Vector2(0,d); // replace 0 with raycasted ground altitude
    var angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
    orbitControls.maxPolarAngle = angleRadians;
  }

  // Lights
  var light	= new THREE.HemisphereLight( 0xfffff0, 0x101020, 1 )
	light.position.set( 0.75, 1, 0.25 )
	scene.add(light)

  scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );

  var spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
  spotLight.position.set( 50, 100, 50 );
  spotLight.angle = Math.PI / 7;
  spotLight.penumbra = 0.8;
  scene.add( spotLight );

  var spotLight2 = new THREE.SpotLight( 0xffffff, 0.5 );
  spotLight2.position.set( -50, -100, -50 );
  spotLight2.angle = Math.PI / 3;
  spotLight2.penumbra = 0.8;
  scene.add( spotLight2 );

  // postProcessing
	var renderPass = new THREE.RenderPass( scene, camera );
  kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );
  //Add Shader Passes to Composer
  //order is important
  composer = new THREE.EffectComposer( renderer);
  composer.addPass( renderPass );
  composer.addPass( kaleidoPass );
  //set last pass in composer chain to renderToScreen
  kaleidoPass.renderToScreen = true;
  // set kaleido variables
  kaleidoPass.uniforms[ "sides" ].value = kaleidoSettings.sides; // 0 - 24
  kaleidoPass.uniforms[ "angle" ].value = kaleidoSettings.angle*3.1416;  // 0.0 - 2.0

  // resize
  window.addEventListener( 'resize', onWindowResize, false );
  onWindowResize();

  //
  createBackgroundPlane(imagePath+activeImage+'.jpg');
  addMonolith();

  //
  createAnimationCanvas();
  startAnimationSequence();

  // start the cycle
  animate();
}


// -- ANIMATE FUNCTION
// ---------------------------------------------
function animate() {
  req = requestAnimationFrame( animate );
  render();
  stats.update();
  checkPerformance();
}

// -- RENDER LOOP
// ---------------------------------------------
var clock = new THREE.Clock();
var a = 0;
var curFrame = 0;
function render() {
  curFrame++;

  var timer = Date.now();
  var myD = clock.getDelta();

  animateChange();
  hoveringMonolith(timer);
  rotatingScene(timer);

  animateCanvas();
  checkForNoInteraction();

  orbitControls.update();
  if (orbitControls!=undefined && camera !=undefined) {
    camPos.x = orbitControls.object.position.x;
    camPos.y = orbitControls.object.position.y;
    camPos.z = orbitControls.object.position.z;
  }

  if (kaleidoActive) {
    composer.render( 0.1);
  } else {
    renderer.render( scene, camera );
  }

}


// -- RESIZE HANDLER
// ---------------------------------------------
var width;
var height;
function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  if (canvas != undefined) {
    canvas.width = width;
    canvas.height = height;
  }

  if (camera != undefined) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  if (renderer != undefined) {
    renderer.setSize( width/canvasScale, height/canvasScale );
    if (canvasScale != 1) {
      jQuery('#WebGL-output canvas').css({width: width, height: height});
    }
  }

  if (tutorialComplete) {
    sequence_three();
    var bBox = width*0.2;
    jQuery('#backgroundBox').css({width: bBox, height: bBox})
    jQuery('#interactiveBox').css({opacity: 1, left: (width-width*0.12)-bBox/2, top: height/2-bBox/2});
    rePositionDots();
  }
}

// -- CAMERA ANIMATION
// ---------------------------------------------
function animateCamTo() {
  orbitControls.object.position.x = camPos.x;
  orbitControls.object.position.y = camPos.y;
  orbitControls.object.position.z = camPos.z;
  camera.fov = camPos.fov;

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.updateProjectionMatrix();
}

// -- RADIANS FUNCTION
// ---------------------------------------------
function radians (angle) {
  return angle * (Math.PI / 180);
}

// -- MAP FUNCTION
// ---------------------------------------------
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// -- RANDOM INT
// ---------------------------------------------
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// -- IF FPS DROP BELOW 50 FPS FOR A TOTAL OF 10 CONSECUCTIVE SECONDS, REMOVE HIGH-DPI-RESOLUTION
// ---------------------------------------------
var lowPerformanceStarted = 0;
var steppedDown = 0;
function checkPerformance() {
  if (highDPI || !reduceResolution) {
    var curFPS = stats.getFPS();
    var timeDiff;
    if (curFPS < 49) {
      if (lowPerformanceStarted == 0) {
        lowPerformanceStarted = new Date();
      }
      curTime = new Date();
      timeDiff = curTime - lowPerformanceStarted; //in ms
    } else {
      lowPerformanceStarted = 0;
    }
    if (timeDiff > 6000) { // 6 seconds
      if (highDPI && (renderer.getPixelRatio() > 1)) {
        console.log('Note: Slow performance on this machine, reducing resolution to non-retina');
        highDPI = false;
        renderer.setPixelRatio( 1 );
        lowPerformance = 0;
        lowPerformanceStarted = 0;
      } else {
        if (steppedDown < 2) {
          console.log('Note: Slow performance on this machine, reducing resolution by 1.5 steps');
          lowPerformanceStarted = 0;
          highDPI = false;
          if (steppedDown == 0) {canvasScale = 1.5;}
          if (steppedDown == 1) {canvasScale = 3;}

          renderer.setSize( window.innerWidth/canvasScale, window.innerHeight/canvasScale );
          jQuery('#WebGL-output canvas').css({width: width, height: height});
          steppedDown++;
        } else { // stop performance check
          reduceResolution = true;
        }
      }
    }
  }
}




// -- ANIMATED TUTORIAL ILLUSTRATIONS AND EVENT-HANDLER
// ---------------------------------------------
var checkForDragCount = 0;
var clickDragHandler;
function addInfoAnimation() {
  jQuery('#infoContainer').css({opacity: 1, top: height/2-35, left: width/2-75});

  // CHECK FOR DRAG
  var currentPos = [];
  clickDragHandler = function(evt) {
    currentPos = [evt.pageX, evt.pageY]
    $(document).on('mousemove touchmove', function handler(evt) {
      currentPos=[evt.pageX, evt.pageY];
      $(document).off('mousemove touchmove', handler);
    });

    $(document).on('mouseup touchend', function handler(evt) {
      if(evt.pageX === currentPos[0] && evt.pageY===currentPos[1]) {
        // this would be a click
        checkForDragCount++;
        if (checkForDragCount > 2) {
          removeDragAnimation();
        }
      }
      else {
        // this would be a drag
        removeDragAnimation();
      }
      $(document).off('mouseup touchend', handler);
    });
  }
  $(document).on('mousedown touchstart', function(event) {
    clickDragHandler(event);
  });
}

var tutorialComplete = false;
function removeDragAnimation() {
  tutorialComplete = true;
  sequence_three();
  activateButtons();
  jQuery('#infoContainer img').attr('src', 'images/touch_small.gif');
  jQuery('#infoContainer').css({left: width-200});
  if (clickDragHandler != undefined) {
    jQuery(document).unbind('mousedown touchstart', clickDragHandler); // remove event handler once successful
    clickDragHandler = function() {};

    jQuery(document).on('mousedown touchstart', function(event) {
      if (!firstClick) {
        firstClick = true;
        jQuery('#infoContainer').css({opacity: 0});
      }
    });
  }
}


var didReset = false;
function checkForNoInteraction() {
  // if (lastInteraction != undefined) {
    curTime = new Date();
    timeDiff = curTime - lastInteraction; //in ms

    if (timeDiff > 50000) { // 40 seconds
      if (!didReset) {
        sequenceOne = {
            rect:           {width: 20, height: 1},
            type:           {size: 0, spacing: 0},
            circleRadius:   5,
            rotation:       0
          };

        sequenceTwo = {
          circleOne:    0,
          circleTwo:    0,
          circleThree:  0
        }

        sequenceThree = {
          x:            0
        }

        jQuery('#infoContainer img').attr('src', 'images/dragToRotate_small.gif');
        jQuery('#interactiveBox').css({opacity: 0});
        TweenLite.to(monolith.children[0].children[0].material, 2, {opacity: 0, ease:Expo.easeIn});
        TweenLite.to(backgroundPlane.children[0].material, 2, {opacity: 0, ease:Expo.easeIn});
        sequence_one();

        tutorialComplete = false;
        didReset = true;
        lastInteraction = undefined;
      }
    }
  // }
}
