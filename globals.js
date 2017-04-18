var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");
var tractCanvas = document.getElementById("tractCanvas");
var tractCtx = tractCanvas.getContext("2d");

var sampleRate;
var time = 0;
var alwaysVoice = true;
var autoWobble = true;
