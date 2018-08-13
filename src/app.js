import AudioSystem from "./audio/audio-system";
import Glottis from "./audio/glottis";
import Tract from "./audio/tract";

import UI from "./ui/ui";
import TractUI from "./ui/tract-ui";

// globals
window.time = 0;
window.sampleRate = 441000;
window.autoWobble = true;
window.alwaysVoice = true;
window.palePink = "#FFEEF5";

Math.clamp = function (number, min, max) {
    if (number < min) return min;
    else if (number > max) return max;
    else return number;
}

Math.moveTowards = function (current, target, amount) {
    if (current < target) return Math.min(current + amount, target);
    else return Math.max(current - amount, target);
}

Math.moveTowards = function (current, target, amountUp, amountDown) {
    if (current < target) return Math.min(current + amountUp, target);
    else return Math.max(current - amountDown, target);
}

Math.gaussian = function () {
    var s = 0;
    for (var c = 0; c < 16; c++) s += Math.random();
    return (s - 8) / 4;
}

// var time = 0;

var noiseFreq = 500;
var noiseQ = 0.7;

var isFirefox = false;
var browser = navigator.userAgent.toLowerCase();
if (browser.indexOf('firefox') > -1) isFirefox = true;

// var UI = {
//     width: 600,
//     top_margin: 5,
//     left_margin: 5,
//     inAboutScreen: false,
//     inInstructionsScreen: false,
//     instructionsLine: 0,
//     debugText: "",

//     init: function () {
//         this.touchesWithMouse = [];
//         this.mouseTouch = {
//             alive: false,
//             endTime: 0
//         };
//         this.mouseDown = false;

//         this.aboutButton = makeButton(460, 392, 140, 30, "about...", true);
//         this.alwaysVoiceButton = makeButton(460, 428, 140, 30, "always voice", true);
//         this.autoWobbleButton = makeButton(460, 464, 140, 30, "pitch wobble", true);

//         tractCanvas.addEventListener('touchstart', UI.startTouches);
//         tractCanvas.addEventListener('touchmove', UI.moveTouches);
//         tractCanvas.addEventListener('touchend', UI.endTouches);
//         tractCanvas.addEventListener('touchcancel', UI.endTouches);

//         document.addEventListener('touchstart', (function (event) {
//             event.preventDefault();
//         }));

//         document.addEventListener('mousedown', (function (event) {
//             UI.mouseDown = true;
//             event.preventDefault();
//             UI.startMouse(event);
//         }));
//         document.addEventListener('mouseup', (function (event) {
//             UI.mouseDown = false;
//             UI.endMouse(event);
//         }));
//         document.addEventListener('mousemove', UI.moveMouse);
//     },

//     draw: function () {
//         this.alwaysVoiceButton.draw(tractCtx);
//         this.autoWobbleButton.draw(tractCtx);
//         this.aboutButton.draw(tractCtx);
//         if (this.inAboutScreen) this.drawAboutScreen();
//         else if (this.inInstructionsScreen) this.drawInstructionsScreen();
//     },

//     drawAboutScreen: function () {
//         var ctx = tractCtx;
//         ctx.globalAlpha = 0.8;
//         ctx.fillStyle = "white";
//         ctx.rect(0, 0, 600, 600);
//         ctx.fill();

//         this.drawAboutText();
//     },

//     drawAboutText: function () {
//         var ctx = tractCtx;
//         ctx.globalAlpha = 1.0;
//         ctx.fillStyle = "#C070C6";
//         ctx.strokeStyle = "#C070C6";
//         ctx.font = "50px Arial";
//         ctx.lineWidth = 3;
//         ctx.textAlign = "center";
//         ctx.strokeText("P i n k   T r o m b o n e", 300, 230);
//         ctx.fillText("P i n k   T r o m b o n e", 300, 230);

//         ctx.font = "28px Arial";
//         ctx.fillText("bare-handed  speech synthesis", 300, 330);

//         ctx.font = "20px Arial";
//         //ctx.fillText("(tap to start)", 300, 380);   

//         if (isFirefox) {
//             ctx.font = "20px Arial";
//             ctx.fillText("(sorry - may work poorly with the Firefox browser)", 300, 430);
//         }
//     },


//     drawInstructionsScreen: function () {
//         AudioSystem.mute();
//         var ctx = tractCtx;
//         ctx.globalAlpha = 0.85;
//         ctx.fillStyle = "white";
//         ctx.rect(0, 0, 600, 600);
//         ctx.fill();

//         ctx.globalAlpha = 1.0;
//         ctx.fillStyle = "#C070C6";
//         ctx.strokeStyle = "#C070C6";
//         ctx.font = "24px Arial";
//         ctx.lineWidth = 2;
//         ctx.textAlign = "center";

//         ctx.font = "19px Arial";
//         ctx.textAlign = "left";
//         this.instructionsLine = 0;
//         this.write("Sound is generated in the glottis (at the bottom left) then ");
//         this.write("filtered by the shape of the vocal tract. The voicebox ");
//         this.write("controls the pitch and intensity of the initial sound.");
//         this.write("");
//         this.write("Then, to talk:");
//         this.write("");
//         this.write("- move the body of the tongue to shape vowels");
//         this.write("");
//         this.write("- touch the oral cavity to narrow it, for fricative consonants");
//         this.write("");
//         this.write("- touch above the oral cavity to close it, for stop consonants");
//         this.write("");
//         this.write("- touch the nasal cavity to open the velum and let sound ");
//         this.write("   flow through the nose.");
//         this.write("");
//         this.write("");
//         this.write("(tap anywhere to continue)");

//         ctx.textAlign = "center";
//         ctx.fillText("[tap here to RESET]", 470, 535);

//         this.instructionsLine = 18.8;
//         ctx.textAlign = "left";
//         this.write("Pink Trombone v1.1");
//         this.write("by Neil Thapen");
//         ctx.fillStyle = "blue";
//         ctx.globalAlpha = 0.6;
//         this.write("venuspatrol.nfshost.com");

//         /*ctx.beginPath();
//         ctx.rect(35, 535, 230, 35);
//         ctx.rect(370, 505, 200, 50);
//         ctx.fill();*/

//         ctx.globalAlpha = 1.0;
//     },


//     instructionsScreenHandleTouch: function (x, y) {
//         if ((x >= 35 && x <= 265) && (y >= 535 && y <= 570)) window.location.href = "http://venuspatrol.nfshost.com";
//         else if ((x >= 370 && x <= 570) && (y >= 505 && y <= 555)) location.reload(false);
//         else {
//             UI.inInstructionsScreen = false;
//             UI.aboutButton.switchedOn = true;
//             AudioSystem.unmute();
//         }
//     },

//     write: function (text) {
//         tractCtx.fillText(text, 50, 100 + this.instructionsLine * 22);
//         this.instructionsLine += 1;
//         if (text == "") this.instructionsLine -= 0.3;
//     },

//     buttonsHandleTouchStart: function (touch) {
//         this.alwaysVoiceButton.handleTouchStart(touch);
//         alwaysVoice = this.alwaysVoiceButton.switchedOn;
//         this.autoWobbleButton.handleTouchStart(touch);
//         autoWobble = this.autoWobbleButton.switchedOn;
//         this.aboutButton.handleTouchStart(touch);

//     },

//     startTouches: function (event) {
//         event.preventDefault();
//         if (!AudioSystem.started) {
//             AudioSystem.started = true;
//             AudioSystem.startSound();
//         }

//         if (UI.inAboutScreen) {
//             UI.inAboutScreen = false;
//             return;
//         }

//         if (UI.inInstructionsScreen) {
//             var touches = event.changedTouches;
//             for (var j = 0; j < touches.length; j++) {
//                 var x = (touches[j].pageX - UI.left_margin) / UI.width * 600;
//                 var y = (touches[j].pageY - UI.top_margin) / UI.width * 600;
//             }
//             UI.instructionsScreenHandleTouch(x, y);
//             return;
//         }


//         var touches = event.changedTouches;
//         for (var j = 0; j < touches.length; j++) {
//             var touch = {};
//             touch.startTime = time;
//             touch.endTime = 0;
//             touch.fricative_intensity = 0;
//             touch.alive = true;
//             touch.id = touches[j].identifier;
//             touch.x = (touches[j].pageX - UI.left_margin) / UI.width * 600;
//             touch.y = (touches[j].pageY - UI.top_margin) / UI.width * 600;
//             touch.index = TractUI.getIndex(touch.x, touch.y);
//             touch.diameter = TractUI.getDiameter(touch.x, touch.y);
//             UI.touchesWithMouse.push(touch);
//             UI.buttonsHandleTouchStart(touch);
//         }

//         UI.handleTouches();
//     },

//     getTouchById: function (id) {
//         for (var j = 0; j < UI.touchesWithMouse.length; j++) {
//             if (UI.touchesWithMouse[j].id == id && UI.touchesWithMouse[j].alive) return UI.touchesWithMouse[j];
//         }
//         return 0;
//     },

//     moveTouches: function (event) {
//         var touches = event.changedTouches;
//         for (var j = 0; j < touches.length; j++) {
//             var touch = UI.getTouchById(touches[j].identifier);
//             if (touch != 0) {
//                 touch.x = (touches[j].pageX - UI.left_margin) / UI.width * 600;
//                 touch.y = (touches[j].pageY - UI.top_margin) / UI.width * 600;
//                 touch.index = TractUI.getIndex(touch.x, touch.y);
//                 touch.diameter = TractUI.getDiameter(touch.x, touch.y);
//             }
//         }
//         UI.handleTouches();
//     },

//     endTouches: function (event) {
//         var touches = event.changedTouches;
//         for (var j = 0; j < touches.length; j++) {
//             var touch = UI.getTouchById(touches[j].identifier);
//             if (touch != 0) {
//                 touch.alive = false;
//                 touch.endTime = time;
//             }
//         }
//         UI.handleTouches();

//         if (!UI.aboutButton.switchedOn) {
//             UI.inInstructionsScreen = true;
//         }
//     },

//     startMouse: function (event) {
//         if (!AudioSystem.started) {
//             AudioSystem.started = true;
//             AudioSystem.startSound();
//         }
//         if (UI.inAboutScreen) {
//             UI.inAboutScreen = false;
//             return;
//         }
//         if (UI.inInstructionsScreen) {
//             var x = (event.pageX - tractCanvas.offsetLeft) / UI.width * 600;
//             var y = (event.pageY - tractCanvas.offsetTop) / UI.width * 600;
//             UI.instructionsScreenHandleTouch(x, y);
//             return;
//         }

//         var touch = {};
//         touch.startTime = time;
//         touch.fricative_intensity = 0;
//         touch.endTime = 0;
//         touch.alive = true;
//         touch.id = "mouse" + Math.random();
//         touch.x = (event.pageX - tractCanvas.offsetLeft) / UI.width * 600;
//         touch.y = (event.pageY - tractCanvas.offsetTop) / UI.width * 600;
//         touch.index = TractUI.getIndex(touch.x, touch.y);
//         touch.diameter = TractUI.getDiameter(touch.x, touch.y);
//         UI.mouseTouch = touch;
//         UI.touchesWithMouse.push(touch);
//         UI.buttonsHandleTouchStart(touch);
//         UI.handleTouches();
//     },

//     moveMouse: function (event) {
//         var touch = UI.mouseTouch;
//         if (!touch.alive) return;
//         touch.x = (event.pageX - tractCanvas.offsetLeft) / UI.width * 600;
//         touch.y = (event.pageY - tractCanvas.offsetTop) / UI.width * 600;
//         touch.index = TractUI.getIndex(touch.x, touch.y);
//         touch.diameter = TractUI.getDiameter(touch.x, touch.y);
//         UI.handleTouches();
//     },

//     endMouse: function (event) {
//         var touch = UI.mouseTouch;
//         if (!touch.alive) return;
//         touch.alive = false;
//         touch.endTime = time;
//         UI.handleTouches();

//         if (!UI.aboutButton.switchedOn) UI.inInstructionsScreen = true;
//     },

//     handleTouches: function (event) {
//         TractUI.handleTouches();
//         Glottis.handleTouches();
//     },

//     updateTouches: function () {
//         var fricativeAttackTime = 0.1;
//         for (var j = UI.touchesWithMouse.length - 1; j >= 0; j--) {
//             var touch = UI.touchesWithMouse[j];
//             if (!(touch.alive) && (time > touch.endTime + 1)) {
//                 UI.touchesWithMouse.splice(j, 1);
//             } else if (touch.alive) {
//                 touch.fricative_intensity = Math.clamp((time - touch.startTime) / fricativeAttackTime, 0, 1);
//             } else {
//                 touch.fricative_intensity = Math.clamp(1 - (time - touch.endTime) / fricativeAttackTime, 0, 1);
//             }
//         }
//     },

//     shapeToFitScreen: function () {
//         if (window.innerWidth <= window.innerHeight) {
//             this.width = window.innerWidth - 10;
//             this.left_margin = 5;
//             this.top_margin = 0.5 * (window.innerHeight - this.width);
//         } else {
//             this.width = window.innerHeight - 10;
//             this.left_margin = 0.5 * (window.innerWidth - this.width);
//             this.top_margin = 5;
//         }
//         document.body.style.marginLeft = this.left_margin;
//         document.body.style.marginTop = this.top_margin;
//         tractCanvas.style.width = this.width;
//         backCanvas.style.width = this.width;
//     }
// }


// var AudioSystem = {
//     blockLength: 512,
//     blockTime: 1,
//     started: false,
//     soundOn: false,

//     init: function () {
//         window.AudioContext = window.AudioContext || window.webkitAudioContext;
//         this.audioContext = new window.AudioContext();
//         sampleRate = this.audioContext.sampleRate;

//         this.blockTime = this.blockLength / sampleRate;
//     },

//     startSound: function () {
//         //scriptProcessor may need a dummy input channel on iOS
//         this.scriptProcessor = this.audioContext.createScriptProcessor(this.blockLength, 2, 1);
//         this.scriptProcessor.connect(this.audioContext.destination);
//         this.scriptProcessor.onaudioprocess = AudioSystem.doScriptProcessor;

//         var whiteNoise = this.createWhiteNoiseNode(2 * sampleRate); // 2 seconds of noise

//         var aspirateFilter = this.audioContext.createBiquadFilter();
//         aspirateFilter.type = "bandpass";
//         aspirateFilter.frequency.value = 500;
//         aspirateFilter.Q.value = 0.5;
//         whiteNoise.connect(aspirateFilter);
//         aspirateFilter.connect(this.scriptProcessor);

//         var fricativeFilter = this.audioContext.createBiquadFilter();
//         fricativeFilter.type = "bandpass";
//         fricativeFilter.frequency.value = 1000;
//         fricativeFilter.Q.value = 0.5;
//         whiteNoise.connect(fricativeFilter);
//         fricativeFilter.connect(this.scriptProcessor);

//         whiteNoise.start(0);
//     },

//     createWhiteNoiseNode: function (frameCount) {
//         var myArrayBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);

//         var nowBuffering = myArrayBuffer.getChannelData(0);
//         for (var i = 0; i < frameCount; i++) {
//             nowBuffering[i] = Math.random(); // gaussian();
//         }

//         var source = this.audioContext.createBufferSource();
//         source.buffer = myArrayBuffer;
//         source.loop = true;

//         return source;
//     },


//     doScriptProcessor: function (event) {
//         var inputArray1 = event.inputBuffer.getChannelData(0);
//         var inputArray2 = event.inputBuffer.getChannelData(1);
//         var outArray = event.outputBuffer.getChannelData(0);
//         for (var j = 0, N = outArray.length; j < N; j++) {
//             var lambda1 = j / N;
//             var lambda2 = (j + 0.5) / N;
//             var glottalOutput = Glottis.runStep(lambda1, inputArray1[j]);

//             var vocalOutput = 0;
//             //Tract runs at twice the sample rate 
//             Tract.runStep(glottalOutput, inputArray2[j], lambda1);
//             vocalOutput += Tract.lipOutput + Tract.noseOutput;
//             Tract.runStep(glottalOutput, inputArray2[j], lambda2);
//             vocalOutput += Tract.lipOutput + Tract.noseOutput;
//             outArray[j] = vocalOutput * 0.125;
//         }
//         Glottis.finishBlock();
//         Tract.finishBlock();
//     },

//     mute: function () {
//         this.scriptProcessor.disconnect();
//     },

//     unmute: function () {
//         this.scriptProcessor.connect(this.audioContext.destination);
//     }

// }


// var Glottis = {
//     timeInWaveform: 0,
//     oldFrequency: 140,
//     newFrequency: 140,
//     UIFrequency: 140,
//     smoothFrequency: 140,
//     oldTenseness: 0.6,
//     newTenseness: 0.6,
//     UITenseness: 0.6,
//     totalTime: 0,
//     vibratoAmount: 0.005,
//     vibratoFrequency: 6,
//     intensity: 0,
//     loudness: 1,
//     isTouched: false,
//     ctx: backCtx,
//     touch: 0,
//     x: 240,
//     y: 530,

//     keyboardTop: 500,
//     keyboardLeft: 0,
//     keyboardWidth: 600,
//     keyboardHeight: 100,
//     semitones: 20,
//     marks: [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
//     baseNote: 87.3071, //F

//     init: function () {
//         this.setupWaveform(0);
//         this.drawKeyboard();
//     },

//     drawKeyboard: function () {
//         this.ctx.strokeStyle = palePink;
//         this.ctx.fillStyle = palePink;
//         backCtx.globalAlpha = 1.0;
//         backCtx.lineCap = 'round';
//         backCtx.lineJoin = 'round';

//         var radius = 2;

//         this.drawBar(0.0, 0.4, 8);
//         backCtx.globalAlpha = 0.7;
//         this.drawBar(0.52, 0.72, 8);

//         backCtx.strokeStyle = "orchid";
//         backCtx.fillStyle = "orchid";
//         for (var i = 0; i < this.semitones; i++) {
//             var keyWidth = this.keyboardWidth / this.semitones;
//             var x = this.keyboardLeft + (i + 1 / 2) * keyWidth;
//             var y = this.keyboardTop;
//             if (this.marks[(i + 3) % 12] == 1) {
//                 backCtx.lineWidth = 4;
//                 backCtx.globalAlpha = 0.4;
//             } else {
//                 backCtx.lineWidth = 3;
//                 backCtx.globalAlpha = 0.2;
//             }
//             backCtx.beginPath();
//             backCtx.moveTo(x, y + 9);
//             backCtx.lineTo(x, y + this.keyboardHeight * 0.4 - 9);
//             backCtx.stroke();

//             backCtx.lineWidth = 3;
//             backCtx.globalAlpha = 0.15;

//             backCtx.beginPath();
//             backCtx.moveTo(x, y + this.keyboardHeight * 0.52 + 6);
//             backCtx.lineTo(x, y + this.keyboardHeight * 0.72 - 6);
//             backCtx.stroke();

//         }

//         backCtx.fillStyle = "orchid";
//         backCtx.font = "17px Arial";
//         backCtx.textAlign = "center";
//         backCtx.globalAlpha = 0.7;
//         backCtx.fillText("voicebox control", 300, 490);
//         backCtx.fillText("pitch", 300, 592);
//         backCtx.globalAlpha = 0.3;
//         backCtx.strokeStyle = "orchid";
//         backCtx.fillStyle = "orchid";
//         backCtx.save()
//         backCtx.translate(410, 587);
//         this.drawArrow(80, 2, 10);
//         backCtx.translate(-220, 0);
//         backCtx.rotate(Math.PI);
//         this.drawArrow(80, 2, 10);
//         backCtx.restore();
//         backCtx.globalAlpha = 1.0;
//     },

//     drawBar: function (topFactor, bottomFactor, radius) {
//         backCtx.lineWidth = radius * 2;
//         backCtx.beginPath();
//         backCtx.moveTo(this.keyboardLeft + radius, this.keyboardTop + topFactor * this.keyboardHeight + radius);
//         backCtx.lineTo(this.keyboardLeft + this.keyboardWidth - radius, this.keyboardTop + topFactor * this.keyboardHeight + radius);
//         backCtx.lineTo(this.keyboardLeft + this.keyboardWidth - radius, this.keyboardTop + bottomFactor * this.keyboardHeight - radius);
//         backCtx.lineTo(this.keyboardLeft + radius, this.keyboardTop + bottomFactor * this.keyboardHeight - radius);
//         backCtx.closePath();
//         backCtx.stroke();
//         backCtx.fill();
//     },

//     drawArrow: function (l, ahw, ahl) {
//         backCtx.lineWidth = 2;
//         backCtx.beginPath();
//         backCtx.moveTo(-l, 0);
//         backCtx.lineTo(0, 0);
//         backCtx.lineTo(0, -ahw);
//         backCtx.lineTo(ahl, 0);
//         backCtx.lineTo(0, ahw);
//         backCtx.lineTo(0, 0);
//         backCtx.closePath();
//         backCtx.stroke();
//         backCtx.fill();
//     },

//     handleTouches: function () {
//         if (this.touch != 0 && !this.touch.alive) this.touch = 0;

//         if (this.touch == 0) {
//             for (var j = 0; j < UI.touchesWithMouse.length; j++) {
//                 var touch = UI.touchesWithMouse[j];
//                 if (!touch.alive) continue;
//                 if (touch.y < this.keyboardTop) continue;
//                 this.touch = touch;
//             }
//         }

//         if (this.touch != 0) {
//             var local_y = this.touch.y - this.keyboardTop - 10;
//             var local_x = this.touch.x - this.keyboardLeft;
//             local_y = Math.clamp(local_y, 0, this.keyboardHeight - 26);
//             var semitone = this.semitones * local_x / this.keyboardWidth + 0.5;
//             Glottis.UIFrequency = this.baseNote * Math.pow(2, semitone / 12);
//             if (Glottis.intensity == 0) Glottis.smoothFrequency = Glottis.UIFrequency;
//             //Glottis.UIRd = 3*local_y / (this.keyboardHeight-20);
//             var t = Math.clamp(1 - local_y / (this.keyboardHeight - 28), 0, 1);
//             Glottis.UITenseness = 1 - Math.cos(t * Math.PI * 0.5);
//             Glottis.loudness = Math.pow(Glottis.UITenseness, 0.25);
//             this.x = this.touch.x;
//             this.y = local_y + this.keyboardTop + 10;
//         }
//         Glottis.isTouched = (this.touch != 0);
//     },

//     runStep: function (lambda, noiseSource) {
//         var timeStep = 1.0 / sampleRate;
//         this.timeInWaveform += timeStep;
//         this.totalTime += timeStep;
//         if (this.timeInWaveform > this.waveformLength) {
//             this.timeInWaveform -= this.waveformLength;
//             this.setupWaveform(lambda);
//         }
//         var out = this.normalizedLFWaveform(this.timeInWaveform / this.waveformLength);
//         var aspiration = this.intensity * (1 - Math.sqrt(this.UITenseness)) * this.getNoiseModulator() * noiseSource;
//         aspiration *= 0.2 + 0.02 * noise.simplex1(this.totalTime * 1.99);
//         out += aspiration;
//         return out;
//     },

//     getNoiseModulator: function () {
//         var voiced = 0.1 + 0.2 * Math.max(0, Math.sin(Math.PI * 2 * this.timeInWaveform / this.waveformLength));
//         //return 0.3;
//         return this.UITenseness * this.intensity * voiced + (1 - this.UITenseness * this.intensity) * 0.3;
//     },

//     finishBlock: function () {
//         var vibrato = 0;
//         vibrato += this.vibratoAmount * Math.sin(2 * Math.PI * this.totalTime * this.vibratoFrequency);
//         vibrato += 0.02 * noise.simplex1(this.totalTime * 4.07);
//         vibrato += 0.04 * noise.simplex1(this.totalTime * 2.15);
//         if (autoWobble) {
//             vibrato += 0.2 * noise.simplex1(this.totalTime * 0.98);
//             vibrato += 0.4 * noise.simplex1(this.totalTime * 0.5);
//         }
//         if (this.UIFrequency > this.smoothFrequency)
//             this.smoothFrequency = Math.min(this.smoothFrequency * 1.1, this.UIFrequency);
//         if (this.UIFrequency < this.smoothFrequency)
//             this.smoothFrequency = Math.max(this.smoothFrequency / 1.1, this.UIFrequency);
//         this.oldFrequency = this.newFrequency;
//         this.newFrequency = this.smoothFrequency * (1 + vibrato);
//         this.oldTenseness = this.newTenseness;
//         this.newTenseness = this.UITenseness +
//             0.1 * noise.simplex1(this.totalTime * 0.46) + 0.05 * noise.simplex1(this.totalTime * 0.36);
//         if (!this.isTouched && alwaysVoice) this.newTenseness += (3 - this.UITenseness) * (1 - this.intensity);

//         if (this.isTouched || alwaysVoice) this.intensity += 0.13;
//         else this.intensity -= 0.05;
//         this.intensity = Math.clamp(this.intensity, 0, 1);
//     },

//     setupWaveform: function (lambda) {
//         this.frequency = this.oldFrequency * (1 - lambda) + this.newFrequency * lambda;
//         var tenseness = this.oldTenseness * (1 - lambda) + this.newTenseness * lambda;
//         this.Rd = 3 * (1 - tenseness);
//         this.waveformLength = 1.0 / this.frequency;

//         var Rd = this.Rd;
//         if (Rd < 0.5) Rd = 0.5;
//         if (Rd > 2.7) Rd = 2.7;
//         var output;
//         // normalized to time = 1, Ee = 1
//         var Ra = -0.01 + 0.048 * Rd;
//         var Rk = 0.224 + 0.118 * Rd;
//         var Rg = (Rk / 4) * (0.5 + 1.2 * Rk) / (0.11 * Rd - Ra * (0.5 + 1.2 * Rk));

//         var Ta = Ra;
//         var Tp = 1 / (2 * Rg);
//         var Te = Tp + Tp * Rk; //

//         var epsilon = 1 / Ta;
//         var shift = Math.exp(-epsilon * (1 - Te));
//         var Delta = 1 - shift; //divide by this to scale RHS

//         var RHSIntegral = (1 / epsilon) * (shift - 1) + (1 - Te) * shift;
//         RHSIntegral = RHSIntegral / Delta;

//         var totalLowerIntegral = -(Te - Tp) / 2 + RHSIntegral;
//         var totalUpperIntegral = -totalLowerIntegral;

//         var omega = Math.PI / Tp;
//         var s = Math.sin(omega * Te);
//         // need E0*e^(alpha*Te)*s = -1 (to meet the return at -1)
//         // and E0*e^(alpha*Tp/2) * Tp*2/pi = totalUpperIntegral 
//         //             (our approximation of the integral up to Tp)
//         // writing x for e^alpha,
//         // have E0*x^Te*s = -1 and E0 * x^(Tp/2) * Tp*2/pi = totalUpperIntegral
//         // dividing the second by the first,
//         // letting y = x^(Tp/2 - Te),
//         // y * Tp*2 / (pi*s) = -totalUpperIntegral;
//         var y = -Math.PI * s * totalUpperIntegral / (Tp * 2);
//         var z = Math.log(y);
//         var alpha = z / (Tp / 2 - Te);
//         var E0 = -1 / (s * Math.exp(alpha * Te));
//         this.alpha = alpha;
//         this.E0 = E0;
//         this.epsilon = epsilon;
//         this.shift = shift;
//         this.Delta = Delta;
//         this.Te = Te;
//         this.omega = omega;
//     },


//     normalizedLFWaveform: function (t) {
//         var output;
//         if (t > this.Te) output = (-Math.exp(-this.epsilon * (t - this.Te)) + this.shift) / this.Delta;
//         else output = this.E0 * Math.exp(this.alpha * t) * Math.sin(this.omega * t);

//         return output * this.intensity * this.loudness;
//     }
// }


// var Tract = {
//     n: 44,
//     bladeStart: 10,
//     tipStart: 32,
//     lipStart: 39,
//     R: [], //component going right
//     L: [], //component going left
//     reflection: [],
//     junctionOutputR: [],
//     junctionOutputL: [],
//     maxAmplitude: [],
//     diameter: [],
//     restDiameter: [],
//     targetDiameter: [],
//     newDiameter: [],
//     A: [],
//     glottalReflection: 0.75,
//     lipReflection: -0.85,
//     lastObstruction: -1,
//     fade: 1.0, //0.9999,
//     movementSpeed: 15, //cm per second
//     transients: [],
//     lipOutput: 0,
//     noseOutput: 0,
//     velumTarget: 0.01,

//     init: function () {
//         this.bladeStart = Math.floor(this.bladeStart * this.n / 44);
//         this.tipStart = Math.floor(this.tipStart * this.n / 44);
//         this.lipStart = Math.floor(this.lipStart * this.n / 44);
//         this.diameter = new Float64Array(this.n);
//         this.restDiameter = new Float64Array(this.n);
//         this.targetDiameter = new Float64Array(this.n);
//         this.newDiameter = new Float64Array(this.n);
//         for (var i = 0; i < this.n; i++) {
//             var diameter = 0;
//             if (i < 7 * this.n / 44 - 0.5) diameter = 0.6;
//             else if (i < 12 * this.n / 44) diameter = 1.1;
//             else diameter = 1.5;
//             this.diameter[i] = this.restDiameter[i] = this.targetDiameter[i] = this.newDiameter[i] = diameter;
//         }
//         this.R = new Float64Array(this.n);
//         this.L = new Float64Array(this.n);
//         this.reflection = new Float64Array(this.n + 1);
//         this.newReflection = new Float64Array(this.n + 1);
//         this.junctionOutputR = new Float64Array(this.n + 1);
//         this.junctionOutputL = new Float64Array(this.n + 1);
//         this.A = new Float64Array(this.n);
//         this.maxAmplitude = new Float64Array(this.n);

//         this.noseLength = Math.floor(28 * this.n / 44)
//         this.noseStart = this.n - this.noseLength + 1;
//         this.noseR = new Float64Array(this.noseLength);
//         this.noseL = new Float64Array(this.noseLength);
//         this.noseJunctionOutputR = new Float64Array(this.noseLength + 1);
//         this.noseJunctionOutputL = new Float64Array(this.noseLength + 1);
//         this.noseReflection = new Float64Array(this.noseLength + 1);
//         this.noseDiameter = new Float64Array(this.noseLength);
//         this.noseA = new Float64Array(this.noseLength);
//         this.noseMaxAmplitude = new Float64Array(this.noseLength);
//         for (var i = 0; i < this.noseLength; i++) {
//             var diameter;
//             var d = 2 * (i / this.noseLength);
//             if (d < 1) diameter = 0.4 + 1.6 * d;
//             else diameter = 0.5 + 1.5 * (2 - d);
//             diameter = Math.min(diameter, 1.9);
//             this.noseDiameter[i] = diameter;
//         }
//         this.newReflectionLeft = this.newReflectionRight = this.newReflectionNose = 0;
//         this.calculateReflections();
//         this.calculateNoseReflections();
//         this.noseDiameter[0] = this.velumTarget;
//     },

//     reshapeTract: function (deltaTime) {
//         var amount = deltaTime * this.movementSpeed;;
//         var newLastObstruction = -1;
//         for (var i = 0; i < this.n; i++) {
//             var diameter = this.diameter[i];
//             var targetDiameter = this.targetDiameter[i];
//             if (diameter <= 0) newLastObstruction = i;
//             var slowReturn;
//             if (i < this.noseStart) slowReturn = 0.6;
//             else if (i >= this.tipStart) slowReturn = 1.0;
//             else slowReturn = 0.6 + 0.4 * (i - this.noseStart) / (this.tipStart - this.noseStart);
//             this.diameter[i] = Math.moveTowards(diameter, targetDiameter, slowReturn * amount, 2 * amount);
//         }
//         if (this.lastObstruction > -1 && newLastObstruction == -1 && this.noseA[0] < 0.05) {
//             this.addTransient(this.lastObstruction);
//         }
//         this.lastObstruction = newLastObstruction;

//         amount = deltaTime * this.movementSpeed;
//         this.noseDiameter[0] = Math.moveTowards(this.noseDiameter[0], this.velumTarget,
//             amount * 0.25, amount * 0.1);
//         this.noseA[0] = this.noseDiameter[0] * this.noseDiameter[0];
//     },

//     calculateReflections: function () {
//         for (var i = 0; i < this.n; i++) {
//             this.A[i] = this.diameter[i] * this.diameter[i]; //ignoring PI etc.
//         }
//         for (var i = 1; i < this.n; i++) {
//             this.reflection[i] = this.newReflection[i];
//             if (this.A[i] == 0) this.newReflection[i] = 0.999; //to prevent some bad behaviour if 0
//             else this.newReflection[i] = (this.A[i - 1] - this.A[i]) / (this.A[i - 1] + this.A[i]);
//         }

//         //now at junction with nose

//         this.reflectionLeft = this.newReflectionLeft;
//         this.reflectionRight = this.newReflectionRight;
//         this.reflectionNose = this.newReflectionNose;
//         var sum = this.A[this.noseStart] + this.A[this.noseStart + 1] + this.noseA[0];
//         this.newReflectionLeft = (2 * this.A[this.noseStart] - sum) / sum;
//         this.newReflectionRight = (2 * this.A[this.noseStart + 1] - sum) / sum;
//         this.newReflectionNose = (2 * this.noseA[0] - sum) / sum;
//     },

//     calculateNoseReflections: function () {
//         for (var i = 0; i < this.noseLength; i++) {
//             this.noseA[i] = this.noseDiameter[i] * this.noseDiameter[i];
//         }
//         for (var i = 1; i < this.noseLength; i++) {
//             this.noseReflection[i] = (this.noseA[i - 1] - this.noseA[i]) / (this.noseA[i - 1] + this.noseA[i]);
//         }
//     },

//     runStep: function (glottalOutput, turbulenceNoise, lambda) {
//         var updateAmplitudes = (Math.random() < 0.1);

//         //mouth
//         this.processTransients();
//         this.addTurbulenceNoise(turbulenceNoise);

//         //this.glottalReflection = -0.8 + 1.6 * Glottis.newTenseness;
//         this.junctionOutputR[0] = this.L[0] * this.glottalReflection + glottalOutput;
//         this.junctionOutputL[this.n] = this.R[this.n - 1] * this.lipReflection;

//         for (var i = 1; i < this.n; i++) {
//             var r = this.reflection[i] * (1 - lambda) + this.newReflection[i] * lambda;
//             var w = r * (this.R[i - 1] + this.L[i]);
//             this.junctionOutputR[i] = this.R[i - 1] - w;
//             this.junctionOutputL[i] = this.L[i] + w;
//         }

//         //now at junction with nose
//         var i = this.noseStart;
//         var r = this.newReflectionLeft * (1 - lambda) + this.reflectionLeft * lambda;
//         this.junctionOutputL[i] = r * this.R[i - 1] + (1 + r) * (this.noseL[0] + this.L[i]);
//         r = this.newReflectionRight * (1 - lambda) + this.reflectionRight * lambda;
//         this.junctionOutputR[i] = r * this.L[i] + (1 + r) * (this.R[i - 1] + this.noseL[0]);
//         r = this.newReflectionNose * (1 - lambda) + this.reflectionNose * lambda;
//         this.noseJunctionOutputR[0] = r * this.noseL[0] + (1 + r) * (this.L[i] + this.R[i - 1]);

//         for (var i = 0; i < this.n; i++) {
//             this.R[i] = this.junctionOutputR[i] * 0.999;
//             this.L[i] = this.junctionOutputL[i + 1] * 0.999;

//             //this.R[i] = Math.clamp(this.junctionOutputR[i] * this.fade, -1, 1);
//             //this.L[i] = Math.clamp(this.junctionOutputL[i+1] * this.fade, -1, 1);    

//             if (updateAmplitudes) {
//                 var amplitude = Math.abs(this.R[i] + this.L[i]);
//                 if (amplitude > this.maxAmplitude[i]) this.maxAmplitude[i] = amplitude;
//                 else this.maxAmplitude[i] *= 0.999;
//             }
//         }

//         this.lipOutput = this.R[this.n - 1];

//         //nose     
//         this.noseJunctionOutputL[this.noseLength] = this.noseR[this.noseLength - 1] * this.lipReflection;

//         for (var i = 1; i < this.noseLength; i++) {
//             var w = this.noseReflection[i] * (this.noseR[i - 1] + this.noseL[i]);
//             this.noseJunctionOutputR[i] = this.noseR[i - 1] - w;
//             this.noseJunctionOutputL[i] = this.noseL[i] + w;
//         }

//         for (var i = 0; i < this.noseLength; i++) {
//             this.noseR[i] = this.noseJunctionOutputR[i] * this.fade;
//             this.noseL[i] = this.noseJunctionOutputL[i + 1] * this.fade;

//             //this.noseR[i] = Math.clamp(this.noseJunctionOutputR[i] * this.fade, -1, 1);
//             //this.noseL[i] = Math.clamp(this.noseJunctionOutputL[i+1] * this.fade, -1, 1);    

//             if (updateAmplitudes) {
//                 var amplitude = Math.abs(this.noseR[i] + this.noseL[i]);
//                 if (amplitude > this.noseMaxAmplitude[i]) this.noseMaxAmplitude[i] = amplitude;
//                 else this.noseMaxAmplitude[i] *= 0.999;
//             }
//         }

//         this.noseOutput = this.noseR[this.noseLength - 1];

//     },

//     finishBlock: function () {
//         this.reshapeTract(AudioSystem.blockTime);
//         this.calculateReflections();
//     },

//     addTransient: function (position) {
//         var trans = {}
//         trans.position = position;
//         trans.timeAlive = 0;
//         trans.lifeTime = 0.2;
//         trans.strength = 0.3;
//         trans.exponent = 200;
//         this.transients.push(trans);
//     },

//     processTransients: function () {
//         for (var i = 0; i < this.transients.length; i++) {
//             var trans = this.transients[i];
//             var amplitude = trans.strength * Math.pow(2, -trans.exponent * trans.timeAlive);
//             this.R[trans.position] += amplitude / 2;
//             this.L[trans.position] += amplitude / 2;
//             trans.timeAlive += 1.0 / (sampleRate * 2);
//         }
//         for (var i = this.transients.length - 1; i >= 0; i--) {
//             var trans = this.transients[i];
//             if (trans.timeAlive > trans.lifeTime) {
//                 this.transients.splice(i, 1);
//             }
//         }
//     },

//     addTurbulenceNoise: function (turbulenceNoise) {
//         for (var j = 0; j < UI.touchesWithMouse.length; j++) {
//             var touch = UI.touchesWithMouse[j];
//             if (touch.index < 2 || touch.index > Tract.n) continue;
//             if (touch.diameter <= 0) continue;
//             var intensity = touch.fricative_intensity;
//             if (intensity == 0) continue;
//             this.addTurbulenceNoiseAtIndex(0.66 * turbulenceNoise * intensity, touch.index, touch.diameter);
//         }
//     },

//     addTurbulenceNoiseAtIndex: function (turbulenceNoise, index, diameter) {
//         var i = Math.floor(index);
//         var delta = index - i;
//         turbulenceNoise *= Glottis.getNoiseModulator();
//         var thinness0 = Math.clamp(8 * (0.7 - diameter), 0, 1);
//         var openness = Math.clamp(30 * (diameter - 0.3), 0, 1);
//         var noise0 = turbulenceNoise * (1 - delta) * thinness0 * openness;
//         var noise1 = turbulenceNoise * delta * thinness0 * openness;
//         this.R[i + 1] += noise0 / 2;
//         this.L[i + 1] += noise0 / 2;
//         this.R[i + 2] += noise1 / 2;
//         this.L[i + 2] += noise1 / 2;
//     }
// };


// var TractUI = {
//     originX: 340,
//     originY: 449,
//     radius: 298,
//     scale: 60,
//     tongueIndex: 12.9,
//     tongueDiameter: 2.43,
//     innerTongueControlRadius: 2.05,
//     outerTongueControlRadius: 3.5,
//     tongueTouch: 0,
//     angleScale: 0.64,
//     angleOffset: -0.24,
//     noseOffset: 0.8,
//     gridOffset: 1.7,
//     fillColour: 'pink',
//     lineColour: '#C070C6',

//     init: function () {
//         this.ctx = tractCtx;
//         this.setRestDiameter();
//         for (var i = 0; i < Tract.n; i++) {
//             Tract.diameter[i] = Tract.targetDiameter[i] = Tract.restDiameter[i];
//         }
//         this.drawBackground();
//         this.tongueLowerIndexBound = Tract.bladeStart + 2;
//         this.tongueUpperIndexBound = Tract.tipStart - 3;
//         this.tongueIndexCentre = 0.5 * (this.tongueLowerIndexBound + this.tongueUpperIndexBound);
//     },

//     moveTo: function (i, d) {
//         var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var wobble = (Tract.maxAmplitude[Tract.n - 1] + Tract.noseMaxAmplitude[Tract.noseLength - 1]);
//         wobble *= 0.03 * Math.sin(2 * i - 50 * time) * i / Tract.n;
//         angle += wobble;
//         var r = this.radius - this.scale * d + 100 * wobble;
//         this.ctx.moveTo(this.originX - r * Math.cos(angle), this.originY - r * Math.sin(angle));
//     },

//     lineTo: function (i, d) {
//         var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var wobble = (Tract.maxAmplitude[Tract.n - 1] + Tract.noseMaxAmplitude[Tract.noseLength - 1]);
//         wobble *= 0.03 * Math.sin(2 * i - 50 * time) * i / Tract.n;
//         angle += wobble;
//         var r = this.radius - this.scale * d + 100 * wobble;
//         this.ctx.lineTo(this.originX - r * Math.cos(angle), this.originY - r * Math.sin(angle));
//     },

//     drawText: function (i, d, text) {
//         var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var r = this.radius - this.scale * d;
//         this.ctx.save();
//         this.ctx.translate(this.originX - r * Math.cos(angle), this.originY - r * Math.sin(angle) + 2); //+8);
//         this.ctx.rotate(angle - Math.PI / 2);
//         this.ctx.fillText(text, 0, 0);
//         this.ctx.restore();
//     },

//     drawTextStraight: function (i, d, text) {
//         var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var r = this.radius - this.scale * d;
//         this.ctx.save();
//         this.ctx.translate(this.originX - r * Math.cos(angle), this.originY - r * Math.sin(angle) + 2); //+8);
//         //this.ctx.rotate(angle-Math.PI/2);
//         this.ctx.fillText(text, 0, 0);
//         this.ctx.restore();
//     },

//     drawCircle: function (i, d, radius) {
//         var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var r = this.radius - this.scale * d;
//         this.ctx.beginPath();
//         this.ctx.arc(this.originX - r * Math.cos(angle), this.originY - r * Math.sin(angle), radius, 0, 2 * Math.PI);
//         this.ctx.fill();
//     },

//     getIndex: function (x, y) {
//         var xx = x - this.originX;
//         var yy = y - this.originY;
//         var angle = Math.atan2(yy, xx);
//         while (angle > 0) angle -= 2 * Math.PI;
//         return (Math.PI + angle - this.angleOffset) * (Tract.lipStart - 1) / (this.angleScale * Math.PI);
//     },
//     getDiameter: function (x, y) {
//         var xx = x - this.originX;
//         var yy = y - this.originY;
//         return (this.radius - Math.sqrt(xx * xx + yy * yy)) / this.scale;
//     },

//     draw: function () {
//         this.ctx.clearRect(0, 0, tractCanvas.width, tractCanvas.height);
//         this.ctx.lineCap = 'round';
//         this.ctx.lineJoin = 'round';

//         this.drawTongueControl();
//         this.drawPitchControl();

//         var velum = Tract.noseDiameter[0];
//         var velumAngle = velum * 4;

//         //first draw fill
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 2;
//         this.ctx.strokeStyle = this.fillColour;
//         this.ctx.fillStyle = this.fillColour;
//         this.moveTo(1, 0);
//         for (var i = 1; i < Tract.n; i++) this.lineTo(i, Tract.diameter[i]);
//         for (var i = Tract.n - 1; i >= 2; i--) this.lineTo(i, 0);
//         this.ctx.closePath();
//         this.ctx.stroke();
//         this.ctx.fill();

//         //for nose
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 2;
//         this.ctx.strokeStyle = this.fillColour;
//         this.ctx.fillStyle = this.fillColour;
//         this.moveTo(Tract.noseStart, -this.noseOffset);
//         for (var i = 1; i < Tract.noseLength; i++) this.lineTo(i + Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i] * 0.9);
//         for (var i = Tract.noseLength - 1; i >= 1; i--) this.lineTo(i + Tract.noseStart, -this.noseOffset);
//         this.ctx.closePath();
//         //this.ctx.stroke();
//         this.ctx.fill();

//         //velum
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 2;
//         this.ctx.strokeStyle = this.fillColour;
//         this.ctx.fillStyle = this.fillColour;
//         this.moveTo(Tract.noseStart - 2, 0);
//         this.lineTo(Tract.noseStart, -this.noseOffset);
//         this.lineTo(Tract.noseStart + velumAngle, -this.noseOffset);
//         this.lineTo(Tract.noseStart + velumAngle - 2, 0);
//         this.ctx.closePath();
//         this.ctx.stroke();
//         this.ctx.fill();



//         //white text
//         this.ctx.fillStyle = "white";
//         this.ctx.font = "20px Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.globalAlpha = 1.0;
//         this.drawText(Tract.n * 0.10, 0.425, "throat");
//         this.drawText(Tract.n * 0.71, -1.8, "nasal");
//         this.drawText(Tract.n * 0.71, -1.3, "cavity");
//         this.ctx.font = "22px Arial";
//         this.drawText(Tract.n * 0.6, 0.9, "oral");
//         this.drawText(Tract.n * 0.7, 0.9, "cavity");


//         this.drawAmplitudes();

//         //then draw lines
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 5;
//         this.ctx.strokeStyle = this.lineColour;
//         this.ctx.lineJoin = 'round';
//         this.ctx.lineCap = 'round';
//         this.moveTo(1, Tract.diameter[0]);
//         for (var i = 2; i < Tract.n; i++) this.lineTo(i, Tract.diameter[i]);
//         this.moveTo(1, 0);
//         for (var i = 2; i <= Tract.noseStart - 2; i++) this.lineTo(i, 0);
//         this.moveTo(Tract.noseStart + velumAngle - 2, 0);
//         for (var i = Tract.noseStart + Math.ceil(velumAngle) - 2; i < Tract.n; i++) this.lineTo(i, 0);
//         this.ctx.stroke();

//         //for nose
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 5;
//         this.ctx.strokeStyle = this.lineColour;
//         this.ctx.lineJoin = 'round';
//         this.moveTo(Tract.noseStart, -this.noseOffset);
//         for (var i = 1; i < Tract.noseLength; i++) this.lineTo(i + Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i] * 0.9);
//         this.moveTo(Tract.noseStart + velumAngle, -this.noseOffset);
//         for (var i = Math.ceil(velumAngle); i < Tract.noseLength; i++) this.lineTo(i + Tract.noseStart, -this.noseOffset);
//         this.ctx.stroke();


//         //velum
//         this.ctx.globalAlpha = velum * 5;
//         this.ctx.beginPath();
//         this.moveTo(Tract.noseStart - 2, 0);
//         this.lineTo(Tract.noseStart, -this.noseOffset);
//         this.moveTo(Tract.noseStart + velumAngle - 2, 0);
//         this.lineTo(Tract.noseStart + velumAngle, -this.noseOffset);
//         this.ctx.stroke();


//         this.ctx.fillStyle = "orchid";
//         this.ctx.font = "20px Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.globalAlpha = 0.7;
//         this.drawText(Tract.n * 0.95, 0.8 + 0.8 * Tract.diameter[Tract.n - 1], " lip");

//         this.ctx.globalAlpha = 1.0;
//         this.ctx.fillStyle = "black";
//         this.ctx.textAlign = "left";
//         this.ctx.fillText(UI.debugText, 20, 20);
//         //this.drawPositions();
//     },

//     drawBackground: function () {
//         this.ctx = backCtx;


//         //text
//         this.ctx.fillStyle = "orchid";
//         this.ctx.font = "20px Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.globalAlpha = 0.7;
//         this.drawText(Tract.n * 0.44, -0.28, "soft");
//         this.drawText(Tract.n * 0.51, -0.28, "palate");
//         this.drawText(Tract.n * 0.77, -0.28, "hard");
//         this.drawText(Tract.n * 0.84, -0.28, "palate");
//         this.drawText(Tract.n * 0.95, -0.28, " lip");

//         this.ctx.font = "17px Arial";
//         this.drawTextStraight(Tract.n * 0.18, 3, "  tongue control");
//         this.ctx.textAlign = "left";
//         this.drawText(Tract.n * 1.03, -1.07, "nasals");
//         this.drawText(Tract.n * 1.03, -0.28, "stops");
//         this.drawText(Tract.n * 1.03, 0.51, "fricatives");
//         //this.drawTextStraight(1.5, +0.8, "glottis")
//         this.ctx.strokeStyle = "orchid";
//         this.ctx.lineWidth = 2;
//         this.ctx.beginPath();
//         this.moveTo(Tract.n * 1.03, 0);
//         this.lineTo(Tract.n * 1.07, 0);
//         this.moveTo(Tract.n * 1.03, -this.noseOffset);
//         this.lineTo(Tract.n * 1.07, -this.noseOffset);
//         this.ctx.stroke();
//         this.ctx.globalAlpha = 0.9;
//         this.ctx.globalAlpha = 1.0;
//         this.ctx = tractCtx;
//     },

//     drawPositions: function () {
//         this.ctx.fillStyle = "orchid";
//         this.ctx.font = "24px Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.globalAlpha = 0.6;
//         var a = 2;
//         var b = 1.5;
//         this.drawText(15, a + b * 0.60, 'æ'); //pat
//         this.drawText(13, a + b * 0.27, 'ɑ'); //part
//         this.drawText(12, a + b * 0.00, 'ɒ'); //pot
//         this.drawText(17.7, a + b * 0.05, '(ɔ)'); //port (rounded)
//         this.drawText(27, a + b * 0.65, 'ɪ'); //pit
//         this.drawText(27.4, a + b * 0.21, 'i'); //peat
//         this.drawText(20, a + b * 1.00, 'e'); //pet
//         this.drawText(18.1, a + b * 0.37, 'ʌ'); //putt   
//         //put ʊ
//         this.drawText(23, a + b * 0.1, '(u)'); //poot (rounded)   
//         this.drawText(21, a + b * 0.6, 'ə'); //pert [should be ɜ]

//         var nasals = -1.1;
//         var stops = -0.4;
//         var fricatives = 0.3;
//         var approximants = 1.1;
//         this.ctx.globalAlpha = 0.8;

//         //approximants
//         this.drawText(38, approximants, 'l');
//         this.drawText(41, approximants, 'w');

//         //?
//         this.drawText(4.5, 0.37, 'h');

//         if (Glottis.isTouched || alwaysVoice) {
//             //voiced consonants
//             this.drawText(31.5, fricatives, 'ʒ');
//             this.drawText(36, fricatives, 'z');
//             this.drawText(41, fricatives, 'v');
//             this.drawText(22, stops, 'g');
//             this.drawText(36, stops, 'd');
//             this.drawText(41, stops, 'b');
//             this.drawText(22, nasals, 'ŋ');
//             this.drawText(36, nasals, 'n');
//             this.drawText(41, nasals, 'm');
//         } else {
//             //unvoiced consonants
//             this.drawText(31.5, fricatives, 'ʃ');
//             this.drawText(36, fricatives, 's');
//             this.drawText(41, fricatives, 'f');
//             this.drawText(22, stops, 'k');
//             this.drawText(36, stops, 't');
//             this.drawText(41, stops, 'p');
//             this.drawText(22, nasals, 'ŋ');
//             this.drawText(36, nasals, 'n');
//             this.drawText(41, nasals, 'm');
//         }
//     },

//     drawAmplitudes: function () {
//         this.ctx.strokeStyle = "orchid";
//         this.ctx.lineCap = "butt";
//         this.ctx.globalAlpha = 0.3;
//         for (var i = 2; i < Tract.n - 1; i++) {
//             this.ctx.beginPath();
//             this.ctx.lineWidth = Math.sqrt(Tract.maxAmplitude[i]) * 3;
//             this.moveTo(i, 0);
//             this.lineTo(i, Tract.diameter[i]);
//             this.ctx.stroke();
//         }
//         for (var i = 1; i < Tract.noseLength - 1; i++) {
//             this.ctx.beginPath();
//             this.ctx.lineWidth = Math.sqrt(Tract.noseMaxAmplitude[i]) * 3;
//             this.moveTo(i + Tract.noseStart, -this.noseOffset);
//             this.lineTo(i + Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i] * 0.9);
//             this.ctx.stroke();
//         }
//         this.ctx.globalAlpha = 1;
//     },

//     drawTongueControl: function () {
//         this.ctx.lineCap = "round";
//         this.ctx.lineJoin = "round";
//         this.ctx.strokeStyle = palePink;
//         this.ctx.fillStyle = palePink;
//         this.ctx.globalAlpha = 1.0;
//         this.ctx.beginPath();
//         this.ctx.lineWidth = 45;

//         //outline
//         this.moveTo(this.tongueLowerIndexBound, this.innerTongueControlRadius);
//         for (var i = this.tongueLowerIndexBound + 1; i <= this.tongueUpperIndexBound; i++) this.lineTo(i, this.innerTongueControlRadius);
//         this.lineTo(this.tongueIndexCentre, this.outerTongueControlRadius);
//         this.ctx.closePath();
//         this.ctx.stroke();
//         this.ctx.fill();

//         var a = this.innerTongueControlRadius;
//         var c = this.outerTongueControlRadius;
//         var b = 0.5 * (a + c);
//         var r = 3;
//         this.ctx.fillStyle = "orchid";
//         this.ctx.globalAlpha = 0.3;
//         this.drawCircle(this.tongueIndexCentre, a, r);
//         this.drawCircle(this.tongueIndexCentre - 4.25, a, r);
//         this.drawCircle(this.tongueIndexCentre - 8.5, a, r);
//         this.drawCircle(this.tongueIndexCentre + 4.25, a, r);
//         this.drawCircle(this.tongueIndexCentre + 8.5, a, r);
//         this.drawCircle(this.tongueIndexCentre - 6.1, b, r);
//         this.drawCircle(this.tongueIndexCentre + 6.1, b, r);
//         this.drawCircle(this.tongueIndexCentre, b, r);
//         this.drawCircle(this.tongueIndexCentre, c, r);

//         this.ctx.globalAlpha = 1.0;

//         //circle for tongue position
//         var angle = this.angleOffset + this.tongueIndex * this.angleScale * Math.PI / (Tract.lipStart - 1);
//         var r = this.radius - this.scale * (this.tongueDiameter);
//         var x = this.originX - r * Math.cos(angle);
//         var y = this.originY - r * Math.sin(angle);
//         this.ctx.lineWidth = 4;
//         this.ctx.strokeStyle = "orchid";
//         this.ctx.globalAlpha = 0.7;
//         this.ctx.beginPath();
//         this.ctx.arc(x, y, 18, 0, 2 * Math.PI);
//         this.ctx.stroke();
//         this.ctx.globalAlpha = 0.15;
//         this.ctx.fill();
//         this.ctx.globalAlpha = 1.0;

//         this.ctx.fillStyle = "orchid";
//     },

//     drawPitchControl: function () {
//         var w = 9;
//         var h = 15;
//         if (Glottis.x) {
//             this.ctx.lineWidth = 4;
//             this.ctx.strokeStyle = "orchid";
//             this.ctx.globalAlpha = 0.7;
//             this.ctx.beginPath();
//             this.ctx.moveTo(Glottis.x - w, Glottis.y - h);
//             this.ctx.lineTo(Glottis.x + w, Glottis.y - h);
//             this.ctx.lineTo(Glottis.x + w, Glottis.y + h);
//             this.ctx.lineTo(Glottis.x - w, Glottis.y + h);
//             this.ctx.closePath();
//             this.ctx.stroke();
//             this.ctx.globalAlpha = 0.15;
//             this.ctx.fill();
//             this.ctx.globalAlpha = 1.0;
//         }
//     },

//     setRestDiameter: function () {
//         for (var i = Tract.bladeStart; i < Tract.lipStart; i++) {
//             var t = 1.1 * Math.PI * (this.tongueIndex - i) / (Tract.tipStart - Tract.bladeStart);
//             var fixedTongueDiameter = 2 + (this.tongueDiameter - 2) / 1.5;
//             var curve = (1.5 - fixedTongueDiameter + this.gridOffset) * Math.cos(t);
//             if (i == Tract.bladeStart - 2 || i == Tract.lipStart - 1) curve *= 0.8;
//             if (i == Tract.bladeStart || i == Tract.lipStart - 2) curve *= 0.94;
//             Tract.restDiameter[i] = 1.5 - curve;
//         }
//     },

//     handleTouches: function () {
//         if (this.tongueTouch != 0 && !this.tongueTouch.alive) this.tongueTouch = 0;

//         if (this.tongueTouch == 0) {
//             for (var j = 0; j < UI.touchesWithMouse.length; j++) {
//                 var touch = UI.touchesWithMouse[j];
//                 if (!touch.alive) continue;
//                 if (touch.fricative_intensity == 1) continue; //only new touches will pass this
//                 var x = touch.x;
//                 var y = touch.y;
//                 var index = TractUI.getIndex(x, y);
//                 var diameter = TractUI.getDiameter(x, y);
//                 if (index >= this.tongueLowerIndexBound - 4 && index <= this.tongueUpperIndexBound + 4 &&
//                     diameter >= this.innerTongueControlRadius - 0.5 && diameter <= this.outerTongueControlRadius + 0.5) {
//                     this.tongueTouch = touch;
//                 }
//             }
//         }

//         if (this.tongueTouch != 0) {
//             var x = this.tongueTouch.x;
//             var y = this.tongueTouch.y;
//             var index = TractUI.getIndex(x, y);
//             var diameter = TractUI.getDiameter(x, y);
//             var fromPoint = (this.outerTongueControlRadius - diameter) / (this.outerTongueControlRadius - this.innerTongueControlRadius);
//             fromPoint = Math.clamp(fromPoint, 0, 1);
//             fromPoint = Math.pow(fromPoint, 0.58) - 0.2 * (fromPoint * fromPoint - fromPoint); //horrible kludge to fit curve to straight line
//             this.tongueDiameter = Math.clamp(diameter, this.innerTongueControlRadius, this.outerTongueControlRadius);
//             //this.tongueIndex = Math.clamp(index, this.tongueLowerIndexBound, this.tongueUpperIndexBound);
//             var out = fromPoint * 0.5 * (this.tongueUpperIndexBound - this.tongueLowerIndexBound);
//             this.tongueIndex = Math.clamp(index, this.tongueIndexCentre - out, this.tongueIndexCentre + out);
//         }

//         this.setRestDiameter();
//         for (var i = 0; i < Tract.n; i++) Tract.targetDiameter[i] = Tract.restDiameter[i];

//         //other constrictions and nose
//         Tract.velumTarget = 0.01;
//         for (var j = 0; j < UI.touchesWithMouse.length; j++) {
//             var intIndex;
//             var touch = UI.touchesWithMouse[j];
//             if (!touch.alive) continue;
//             var x = touch.x;
//             var y = touch.y;
//             var index = TractUI.getIndex(x, y);
//             var diameter = TractUI.getDiameter(x, y);
//             if (index > Tract.noseStart && diameter < -this.noseOffset) {
//                 Tract.velumTarget = 0.4;
//             }
//             temp.a = index;
//             temp.b = diameter;
//             if (diameter < -0.85 - this.noseOffset) continue;
//             diameter -= 0.3;
//             if (diameter < 0) diameter = 0;
//             var width = 2;
//             if (index < 25) width = 10;
//             else if (index >= Tract.tipStart) width = 5;
//             else width = 10 - 5 * (index - 25) / (Tract.tipStart - 25);
//             if (index >= 2 && index < Tract.n && y < tractCanvas.height && diameter < 3) {
//                 intIndex = Math.round(index);
//                 for (var i = -Math.ceil(width) - 1; i < width + 1; i++) {
//                     if (intIndex + i < 0 || intIndex + i >= Tract.n) continue;
//                     var relpos = (intIndex + i) - index;
//                     relpos = Math.abs(relpos) - 0.5;
//                     var shrink;
//                     if (relpos <= 0) shrink = 0;
//                     else if (relpos > width) shrink = 1;
//                     else shrink = 0.5 * (1 - Math.cos(Math.PI * relpos / width));
//                     if (diameter < Tract.targetDiameter[intIndex + i]) {
//                         Tract.targetDiameter[intIndex + i] = diameter + (Tract.targetDiameter[intIndex + i] - diameter) * shrink;
//                     }
//                 }
//             }
//         }
//     },

// }


document.body.style.cursor = 'pointer';

AudioSystem.init();
UI.init();
Glottis.init();
Tract.init();
TractUI.init();

requestAnimationFrame(redraw);

function redraw(highResTimestamp) {
    UI.shapeToFitScreen();
    TractUI.draw();
    UI.draw();
    requestAnimationFrame(redraw);
    time = Date.now() / 1000;
    UI.updateTouches();
}



/**********************************************************************************/
/**********************************************************************************/

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

// (function (global) {
    var module = global.noise = {};

    function Grad(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Grad.prototype.dot2 = function (x, y) {
        return this.x * x + this.y * y;
    };

    Grad.prototype.dot3 = function (x, y, z) {
        return this.x * x + this.y * y + this.z * z;
    };

    var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
        new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
        new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
    ];

    var p = [151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];
    // To remove the need for index wrapping, double the permutation table length
    var perm = new Array(512);
    var gradP = new Array(512);

    // This isn't a very good seeding function, but it works ok. It supports 2^16
    // different seed values. Write something better if you need more seeds.
    module.seed = function (seed) {
        if (seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }

        for (var i = 0; i < 256; i++) {
            var v;
            if (i & 1) {
                v = p[i] ^ (seed & 255);
            } else {
                v = p[i] ^ ((seed >> 8) & 255);
            }

            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = grad3[v % 12];
        }
    };

    module.seed(Date.now());

    /*
    for(var i=0; i<256; i++) {
      perm[i] = perm[i + 256] = p[i];
      gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
    }*/

    // Skewing and unskewing factors for 2, 3, and 4 dimensions
    var F2 = 0.5 * (Math.sqrt(3) - 1);
    var G2 = (3 - Math.sqrt(3)) / 6;

    var F3 = 1 / 3;
    var G3 = 1 / 6;

    // 2D simplex noise
    module.simplex2 = function (xin, yin) {
        var n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin - j + t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 1;
            j1 = 0;
        } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1 = 0;
            j1 = 1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        var gi0 = gradP[i + perm[j]];
        var gi1 = gradP[i + i1 + perm[j + j1]];
        var gi2 = gradP[i + 1 + perm[j + 1]];
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    };

    module.simplex1 = function (x) {
        return module.simplex2(x * 1.2, -x * 0.7);
    };


// })(this);