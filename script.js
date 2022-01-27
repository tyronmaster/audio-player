/* Вариант если браузер не поддерживает АудиоКонтекст

var context;
window.addEventListener('load', function(){
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Opps.. Your browser do not support audio API');
  }
}, false);
 
*/

var context = new (window.AudioContext || window.webkitAudioContext)();
var myAudio = document.querySelector('audio');


// Create a MediaElementAudioSourceNode
// Feed the HTMLMediaElement into it
var source = context.createMediaElementSource(myAudio);


// Создание "усилителя" звука. 
var gainNode = context.createGain();
gainNode.gain.value = 0.5 // изменяется от 0 до 1
// Усилитель нужно вставить в цепочку между источником и получателем
// connect the AudioBufferSourceNode to the gainNode
// and the gainNode to the destination, so we can play the
// music and adjust the volume using the mouse cursor
source.connect(gainNode);
gainNode.connect(context.destination);


// начало воспроизведения 
source.start(0);