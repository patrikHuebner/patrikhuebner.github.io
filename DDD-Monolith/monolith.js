// -- CREATE BACKGROUND PLANE
// ---------------------------------------------
var backgroundPlane;
function createBackgroundPlane(theFile) {
  backgroundPlane = new THREE.Object3D();

  var loader = new THREE.TextureLoader();
  loader.load(
  	theFile,
  	function ( texture ) { // onLoad callback
        var textureMaterial = new THREE.MeshPhongMaterial( {
          // flatShading:    true,
          side	: THREE.BackSide,
          depthWrite: false,
          map: texture,
          specular: 0x050505,
      		shininess: 100,
          transparent: true,
          opacity: 0,
          emissive: 0x111111,
        });
        var geometry = new THREE.SphereGeometry( 14, 32, 32 );

        // modify UVs to accommodate MatCap texture
        var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
        for ( i = 0; i < faceVertexUvs.length; i ++ ) {
          var uvs = faceVertexUvs[ i ];
          var face = geometry.faces[ i ];

          for ( var j = 0; j < 3; j ++ ) {
            uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
            uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;
          }
        }
        var mesh = new THREE.Mesh( geometry, textureMaterial );
        backgroundPlane.add(mesh);
        scene.add(backgroundPlane);
  	},
  	function () { // onError callback
  		console.error( 'Error loading background-image-texture' );
  	}
  );

}

// -- CHANGE BACKGROUND PLANE
// ---------------------------------------------
var changeAnimation = {
  planeOpacity: 0,
  monolithOpacity: 0,
  doAnimate: false
}
function changeTexture(theFile) {
  var loader = new THREE.TextureLoader();
  loader.load(
  	theFile,
  	function ( texture ) { // onLoad callback
      TweenLite.killTweensOf(window);
      TweenLite.killTweensOf(changeAnimation);
      TweenLite.killTweensOf(camPos);

      changeAnimation.doAnimate = true;
      TweenLite.to(camPos, 2, {x:getRandomInt(-20,20), y:0, z:3, fov: 40, ease:Quad.easeOut, onUpdate:animateCamTo});
      TweenLite.to(changeAnimation, 1, {planeOpacity: 0, monolithOpacity: 0, ease:Quad.easeOut, onComplete: function() {

        // change background of sphere
        backgroundPlane.children[0].material.map = texture;
        // change background of monolith
        monolith.children[0].traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
            child.material.map = texture;
          }
        });
        // animate back in
        TweenLite.to(changeAnimation, 2, {planeOpacity: 1, monolithOpacity: 1, ease:Quad.easeIn, onComplete: function() {
          TweenLite.to(camPos, 3, {x:0, y:0, z:8, fov: 40, ease:Expo.easeInOut, onUpdate:animateCamTo});
          changeAnimation.doAnimate = false;
        }}); // tween #2 back in

      }}); // tween #1 out

  	},
  	function () { // onError callback
  		console.error( 'Error loading background-image-texture' );
  	}
  );
}

// -- ANIMATE TEXTURE CHANGE
// ---------------------------------------------
function animateChange() {
  if (changeAnimation.doAnimate) {
    backgroundPlane.children[0].material.opacity = changeAnimation.planeOpacity;
    monolith.children[0].children[0].material.opacity = changeAnimation.monolithOpacity;
  }
}

// -- ADD MONOLITH OBJECT
// ---------------------------------------------
function addMonolith() {
  // material
  var material	= new THREE.MeshPhongMaterial({
    color	: 0xffe0a1,
    specular: 0xffffff,
    shininess: 30,
    transparent: true,
  });

  // texture
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    // console.log( item, loaded, total );
  };
  var textureLoader = new THREE.TextureLoader( manager );
  var texture = textureLoader.load( imagePath+activeImage+'.jpg' );

  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      // console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };
  var onError = function ( xhr ) {
  };
  // load object
  var loader = new THREE.OBJLoader( manager );
  loader.load( 'model/monolith.obj', function ( object ) {
    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material = material;
        child.material.map = texture;

        // points
        var pointsMaterial = new THREE.PointsMaterial( {
          color: 0xffffff,
          size: 0.1,
          transparent: true,
         });
        var pointsField = new THREE.Points( child.geometry, pointsMaterial );
        // child.add( pointsField );

        // wireframe
        var geo = new THREE.EdgesGeometry( child.geometry ); // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1, transparent: true } );
        var wireframe = new THREE.LineSegments( geo, mat );
        child.add( wireframe );
      }
    });

    object.position.y = 0;

    var scale = 0.05;
    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;

    object.children[0].material.opacity = 0;

    // calculate bounding-box of shoe. We need this to rotate it in the desired way.
    var box = new THREE.Box3().setFromObject( object );
    var boxCenter = box.getCenter( object.position ); // this re-sets the mesh position
    object.position.multiplyScalar( - 1 );

    monolith = new THREE.Object3D();
    monolith.add( object );
    scene.add( monolith );

  }, onProgress, onError );

}



function hoveringMonolith(timer) {
  if (monolith != undefined && doHoverMonolith) {
    monolith.position.y = ( Math.sin(radians(timer)*0.1)*0.1 ) + 0.1 ;
    monolith.rotation.y = radians(timer)*0.005;
    // monolith.children[0].children[0].material.opacity = Math.abs(Math.cos(curFrame*0.002));
    // monolith.children[0].children[0].children[0].material.opacity = Math.abs(Math.sin(curFrame*0.02));
  }
}


function rotatingScene(timer) {
  if (scene != undefined) {
    scene.rotation.y = 0.6+radians(timer)*0.005;
  }
}
