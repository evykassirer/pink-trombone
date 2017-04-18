document.body.style.cursor = 'pointer';

AudioSystem.init();
UI.init();
Glottis.init();
Tract.init();
TractUI.init();

requestAnimationFrame(redraw);
function redraw(highResTimestamp)
{
    UI.shapeToFitScreen();
    TractUI.draw();
    UI.draw();
    requestAnimationFrame(redraw);
    time = Date.now()/1000;
    UI.updateTouches();
}
