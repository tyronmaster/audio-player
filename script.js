/* SONGS LIST ========================================================= */
const songsList = ["AK - Deep Blue", 
                    "Aphex Twin - Rhubarb", 
                    "Evocativ feat Arch - Lost In a Dream", 
                    "Autechre - 444", 
                    "God Is An Astronaut - Echoes"];
/* songs list --------------------------------------------------------- */

/* NAVIGATION ACTIONS ====================================== */

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

// open playlist
burgerButton.addEventListener("click", () => {
  playlist.classList.add("active");
});

// close playlist
backButton.addEventListener("click", () => {
  playlist.classList.remove("active");
});

// open/close volume input
volume.addEventListener("click", () => {
    volumebar.classList.toggle("active");
});

/* navigation setion ends ----------------------------------------- */

/* CREATE AUDIO =================================================== */
var songIndex = 0;
var song = songsList[songIndex];
const audio = document.querySelector("audio");
const progressBar = document.querySelector(".progressbar");
const songTitle = document.querySelector(".songtitle");
const songImage = document.querySelector(".image__container img");
const currentTime = document.querySelector(".currenttime");
const durationTime = document.querySelector(".duration");

window.onload = function() {
  loadTrack(getRandomInt(songsList.length-1));
  playButton.classList.remove("active");
  songTitle.textContent = "Press PLAY to start";
}
//audio.src = "./assets/sounds/AK - Deep Blue.mp3";
audio.volume = parseInt(volumebar.value) / 100;

function loadTrack(i){
  progressBar.value = 0;
  songIndex = i;
  song = songsList[songIndex];
  
  audio.src = `./assets/sounds/${song}.mp3`;
  songImage.src = `./assets/img/${song}.jpg`;
  
  /* test version doesn't work properly */
      // test if image exists
  /*    if (!isImageExist(songImage.src)) {
        songImage.src = "./assets/img/blankimage.jpg";
      } else {
        songImage.src = `./assets/img/${song}.jpg`;
      } */

  songTitle.textContent = song;

  //playstop();
}

playButton.addEventListener("click", function() {
  playstop();
});

function playstop() {
  playButton.classList.add("active");
  if (audio.paused){
    playSvg.classList.add("active");
    pauseSvg.classList.remove("active");
    audio.play();
    visualizer();
    songTitle.textContent = `Track 0${songIndex + 1} - ${song}`;
  }  else {
    playSvg.classList.remove("active");
    pauseSvg.classList.add("active");
    audio.pause();
    songTitle.textContent = "TRACK PAUSED";
  }
};
/* play section ends ---------------------------------------------- */


/* NEXT PREV  BUTTONS =================================== */
const nextButon = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

nextButon.addEventListener("click", function () {
  progressBar.value = 0;
  if (shuffle.classList.contains("active")) {
    songIndex = getRandomInt(songsList.length - 1);
  } else {
    songIndex++;
  }
  if (songIndex > songsList.length-1) {
  songIndex = 0;
  }
  loadTrack(songIndex);
  playstop();
  
  // remove focus from element
  this.blur();
});

prevButton.addEventListener("click", function () {
  progressBar.value = 0;
  if (shuffle.classList.contains("active")) {
    songIndex = getRandomInt(songsList.length - 1);
  } else {
    songIndex--;
  }
  if (songIndex < 0) {
    songIndex = songsList.length - 1;
  }
  loadTrack(songIndex);  
  playstop();

  // remove focus from element
  this.blur();
});
/* next prev buttons ------------------------------------------- */



/* VOLUME SECTION ============================================ DONE */
// set volume level according to input value
volumebar.addEventListener("click", setVolume);
volumebar.addEventListener("wheel",  setVolume);

function setVolume() {
  volumebar.focus();
  if (volumebar.value == 0){
    soundOn.classList.remove("active");
    soundOff.classList.add("active");
    } else {
      soundOn.classList.add("active");
      soundOff.classList.remove("active");
    }
    audio.volume = parseInt(volumebar.value) / 100;
};
/* volume section ----------------------------------------------- */


/* PROGRESS BAR ================================================== DONE */
progressBar.addEventListener("click", function () {
  audio.currentTime = parseInt(progressBar.value * audio.duration /100);
});
progressBar.addEventListener("wheel", function(e) {
  e.preventDefault();
});

audio.addEventListener("timeupdate", function () {
  progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;
  currentTime.textContent = timeParser(audio.currentTime);
});
audio.addEventListener("loadeddata", function () {
  durationTime.textContent = timeParser(audio.duration);
});
audio.addEventListener("ended", function (){
  if (shuffle.classList.contains("active")) {
    songIndex = getRandomInt(songsList.length - 1);
  } else if (loop.classList.contains("active")) {
    songIndex = songIndex;
  } else { songIndex++; }
  if (songIndex > songsList.length-1) {
  songIndex = 0;
  }
  loadTrack(songIndex);
  playstop();
});
/* progress bar -------------------------------------------------- */



/* SHUFFLE BUTTON STARTS ======================================= */
const shuffle = document.querySelector(".shuffle");

shuffle.addEventListener("click", function () {
  shuffle.classList.toggle("active");
  loop.classList.remove("active");
  // remove focus from element
  shuffle.blur();
});
/* shuffle button ends ----------------------------------------- */


/* LOOP BUTTON STARTS ======================================= */
const loop = document.querySelector(".loop");

loop.addEventListener("click", function () {
  loop.classList.toggle("active");
  shuffle.classList.remove("active");
  // remove focus from element
  loop.blur();
});
/* loop button ends ----------------------------------------- */










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



/* TECHNICAL FUNCTIONS */

function timeParser(duration){
  let seconds = Math.floor(duration) % 60;
  if (seconds < 10){
    seconds = `0${seconds}`;
  }
  let minutes = (Math.floor(duration) - seconds) / 60;
  return `${minutes}:${seconds}`;
};

function isImageExist(url) {
  var img = new Image();
  img.src = url;
  return img.height != 0;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}