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
