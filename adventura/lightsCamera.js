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
