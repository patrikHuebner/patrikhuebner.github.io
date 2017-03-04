var useMP3 = true;
var fft;
var analyzer;
var mic;
var loaded = false;
var spectrum;
var rms;
var sound;
var audioIsPlaying;
var startTheSketch = false;

function preload(){
  sound = loadSound('mp3/MikeGao-Adventura96kbps.mp3');
  /*
  if (isTouchSupported()) {
    jQuery('#mobileInfo').css({display: 'block'});
  }
  */
  var preLoadImg;
  preLoadImg = loadImage("img/cover.jpg");
  preLoadImg = loadImage("img/env2/negx.jpg");
  preLoadImg = loadImage("img/env2/negy.jpg");
  preLoadImg = loadImage("img/env2/negz.jpg");
  preLoadImg = loadImage("img/env2/posx.jpg");
  preLoadImg = loadImage("img/env2/posy.jpg");
  preLoadImg = loadImage("img/env2/posz.jpg");

}

function setup() {


    fft = new p5.FFT(0.9,16);
    analyzer = new p5.Amplitude();
    analyzer.smooth(0.6);
    init();
    //sound.loop();
    loaded = true;
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

function startSketch() {
  jQuery('#playWrapper').remove();

  sound.loop();
  startTheSketch = true;
  animate();
  addCueSet();

}
