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
  if (startTheSketch) {

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
