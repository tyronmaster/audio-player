/* SONGS LIST ========================================================= */
const songsList = ["AK - Deep Blue", "Aphex Twin - Rhubarb", "Evocativ feat Arch - Lost In a Dream", "Autechre - 444", "God Is An Astronaut - Echoes"];
/* songs list --------------------------------------------------------- */



/* AUDIO CONTEXT STARTS ================================================ */
var audioCtx = new AudioContext();
var audio = new Audio();

var songIndex = 0;
var song = songsList[songIndex];
audio.src = `./assets/sounds/${song}.mp3`;
/* audio context ends -------------------------------------------------- */



/* PLAY STOP BUTTON SECTION STARTS ===================================== */
const playstopButton = document.querySelector(".play__stop");
const playButton = document.querySelector(".play__button");
const pauseButton = document.querySelector(".pause__button");
const songTitle = document.querySelector(".song__title");

const playerImage = document.querySelector(".player__image img");
playerImage.src = `./assets/img/${song}.jpg`;

const trackDuration = document.querySelector(".tracklength");

playstopButton.addEventListener("click", playstop);

function playstop() {
  if (audio.paused){
    playstopButton.classList.add("active");
    playButton.classList.remove("invisible");
    pauseButton.classList.add("invisible");
    audio.play();
    visualizer();
    
    songTitle.textContent = song;
    
  }
  else {
    playButton.classList.add("invisible");
    pauseButton.classList.remove("invisible");
    playstopButton.classList.remove("active");
    audio.pause();
    
    songTitle.textContent = "TRACK PAUSED";
  }

  playerImage.src = `./assets/img/${song}.jpg`;

  // test if image exists
  if (!isImageExist(playerImage.src)) {
    playerImage.src = "./assets/img/blankimage.jpg";
  }

};
/* play stop buttons section ends ---------------------------------------*/


/* VISUALIZER ========================================== */
// create canvas context
const canvas = document.querySelector(".canvas");
const canvasCtx = canvas.getContext('2d');

var audioSource = audioCtx.createMediaElementSource(audio);
var analyser;

function visualizer() {

  // wrong way
  //const files = this.files;
  //const audio = document.querySelector(".audio");
  //audio.src = URL.createObjectURL(files[0]);
  // audio.load();
  // audio.play();

  // audioSource = audioCtx.createMediaElementSource(audio);
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
      gradient.addColorStop(0, "#002245");
      //gradient.addColorStop(.75, "#0022ff");
      gradient.addColorStop(1, "#009ee3");
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight/1.5, barWidth, barHeight);
      x += barWidth;
  }
};
/* visualizer ends ------------------------------------------ */


function loadTrack(songIndex){
  song = songsList[songIndex];
  audio.src = `./assets/sounds/${song}.mp3`;
  playstop();
};

function isImageExist(url) {
  var img = new Image();
  img.src = url;
  return img.height != 0;
};

function timeParser(duration){
  let seconds = Math.floor(duration) % 60;
  let minutes = (Math.floor(duration) - seconds) / 60;
  return `${minutes}:${seconds}`;
};


/* NEXT PREV  BUTTONS =================================== */
const nextButon = document.querySelector(".next__track");
const prevButton = document.querySelector(".prev__track");

nextButon.addEventListener("click", function () {
  songIndex++;
  if (songIndex > songsList.length-1) {
  songIndex = 0;
  }
  loadTrack(songIndex);
  
  // remove focus from element
  this.blur();
});

prevButton.addEventListener("click", function () {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songsList.length - 1;
  }
  loadTrack(songIndex);  

  // remove focus from element
  this.blur();
});
/* next prev buttons ------------------------------------------- */


/* PROGRESS BAR STARTS ========================================= */
const progressBar = document.querySelector(".timebar");
const currentTimeItem = document.querySelector(".currentlength");
var progress = 0;
progressBar.value = 0;

progressBar.addEventListener("click", function () {
  audio.currentTime = parseInt(progressBar.value * audio.duration /100);
});

progressBar.addEventListener("wheel", function(e) {
  e.preventDefault();
});

audio.addEventListener("timeupdate", function () {
  progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;
  currentTimeItem.textContent = timeParser(audio.currentTime);
});
audio.addEventListener("loadeddata", function () {
  trackDuration.textContent = timeParser(audio.duration);
});



audio.addEventListener("ended", function (){
  songIndex++;
  if (songIndex > songsList.length-1) {
  songIndex = 0;
  }
  loadTrack(songIndex);
});
/* progress bar ends ------------------------------------------- */




/* SHUFFLE BUTTON STARTS ======================================= */
const shuffle = document.querySelector(".shuffle");

shuffle.addEventListener("click", function () {
  shuffle.classList.toggle("active");

  // remove focus from element
  shuffle.blur();
})
/* shuffle button ends ----------------------------------------- */


/* LOOP BUTTON STARTS ======================================= */
const loop = document.querySelector(".loop");

loop.addEventListener("click", function () {
  loop.classList.toggle("active");

  // remove focus from element
  loop.blur();
})
/* loop button ends ----------------------------------------- */





/* VOLUME SECTION STARTS ==================================== */
const volume = document.querySelector(".volume__range");
const soundOn = document.querySelector(".sound-on");
const soundOff = document.querySelector(".sound-off");
const volumeButton = document.querySelector(".volume__sign");
const volumeLevel = document.querySelector(".volume__level");

volume.value = 50;
audio.value = volume.value / 100;

volumeButton.addEventListener("click", function() {
  
  this.classList.toggle("active");

  this.blur();
  
  if (soundOff.classList.contains("invisible")) {
    soundOn.classList.add("invisible");
    soundOff.classList.remove("invisible");
    audio.volume = 0;
    volume.value = 0;
  } else {
    soundOn.classList.remove("invisible");
    soundOff.classList.add("invisible");
    audio.volume = 0.5;
    volume.value = Math.floor(audio.volume * 100);
  }
  volumeLevel.textContent = volume.value;
});

function setVolume() {
  audio.volume = parseInt(volume.value) / 100;
  volumeButton.classList.remove("active");
  soundOn.classList.remove("invisible");
  soundOff.classList.add("invisible");

  volumeLevel.textContent = volume.value;
};

volume.addEventListener("click", function () {
  setVolume();
});

volume.addEventListener("wheel", function() {
  setVolume();
});

/*
var gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5; // vary from 0 to 1
audioSource.connect(gainNode);
gainNode.connect(audioCtx.destination);

function setVolume(num) {
  num = parseInt(num) / 100;
  gainNode.gain.setValueAtTime(num, audioCtx.currentTime);
  audioSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  console.log(gainNode.gain.value);
}

volume.addEventListener("click", function(){
  console.log(this.value);
  setVolume(this.value);
});
*/
/* volme section ends --------------------------------------- */

/*

// начало воспроизведения 
source.start(0);
*/