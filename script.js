/* NAVIGATION ACTIONS ===================================== */

const burgerButton = document.querySelector(".burger");
const backButton = document.querySelector(".back");
const playlist = document.querySelector(".playlist");
const volume = document.querySelector(".volume");
const volumebar = document.querySelector(".volumebar");
const soundOn = document.querySelector(".sound-on");
const soundOff = document.querySelector(".sound-off");
const playButton = document.querySelector(".play");
const playSvg = document.querySelector(".play-svg");
const pauseSvg = document.querySelector(".pause-svg");

burgerButton.addEventListener("click", () => {
  playlist.classList.add("active");
});
backButton.addEventListener("click", () => {
  playlist.classList.remove("active");
});
volume.addEventListener("click", () => {
    volumebar.classList.toggle("active");
});
volumebar.addEventListener("change", function () {
  if (this.value == 0){
  soundOn.classList.remove("active");
  soundOff.classList.add("active");
  } else {
    soundOn.classList.add("active");
    soundOff.classList.remove("active");
  }
  audio.volume = parseInt(this.value) / 100;
});


/* CREATE AUDIO ===================================== */
var audio = document.querySelector("audio");
audio.src = "./assets/sounds/AK - Deep Blue.mp3";
audio.volume = parseInt(volumebar.value) / 100;

playButton.addEventListener("click", function() {
  this.classList.add("active");
  if (audio.paused){
    audio.play();
    playSvg.classList.add("active");
    pauseSvg.classList.remove("active");

    visualizer()
  } else {
    audio.pause();
    playSvg.classList.remove("active");
    pauseSvg.classList.add("active");
  }
});


/* VISUALIZER ========================================== */
// create canvas context
const canvas = document.querySelector(".canvas");
const canvasCtx = canvas.getContext('2d');

var audioCtx = new AudioContext();
var audioSource = audioCtx.createMediaElementSource(audio);
var analyser;

function visualizer() {
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // drawing bars
  const barWidth = canvas.width / bufferLength;
  var barHeight;
  var x;

  function animate(){
      x = 0;
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      requestAnimationFrame(animate);
  }
  animate();
};

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
  for (let i = 0; i < bufferLength; i++){
      barHeight = dataArray[i];
      var gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, "#009ee3");
      //gradient.addColorStop(0, "#002245");
      //gradient.addColorStop(.75, "#0022ff");
      //gradient.addColorStop(1, "#009ee3");
      gradient.addColorStop(1, "#ffffff");
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight/1.5, barWidth, barHeight);
      x += barWidth;
  }
};
/* visualizer ends ------------------------------------------ */