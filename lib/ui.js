/*
    globals used:

    tractCanvas
    tractCtx
    alwaysVoice
    autoWobble
    backCanvas

    read-only globals:

    time
    cachedIsFirefox
 */
var UI =
{
    width : 600,
    top_margin : 5,
    left_margin : 5,
    inAboutScreen : true,
    inInstructionsScreen : false,
    instructionsLine : 0,
    debugText : "",
    isFirefox : isFirefox(),

    init : function()
    {
        this.touchesWithMouse = [];
        this.mouseTouch = {alive: false, endTime: 0};
        this.mouseDown = false;

        this.aboutButton = makeButton(460, 392, 140, 30, "about...", true);
        this.alwaysVoiceButton = makeButton(460, 428, 140, 30, "always voice", true);
        this.autoWobbleButton = makeButton(460, 464, 140, 30, "pitch wobble", true);

        tractCanvas.addEventListener('touchstart', UI.startTouches);
        tractCanvas.addEventListener('touchmove', UI.moveTouches);
        tractCanvas.addEventListener('touchend', UI.endTouches);
        tractCanvas.addEventListener('touchcancel', UI.endTouches);

        document.addEventListener('touchstart', (function(event) {event.preventDefault();}) );

        document.addEventListener('mousedown', (function(event)
            {UI.mouseDown = true; event.preventDefault(); UI.startMouse(event);}));
        document.addEventListener('mouseup', (function(event)
            {UI.mouseDown = false; UI.endMouse(event);}));
        document.addEventListener('mousemove', UI.moveMouse);
    },

    draw : function()
    {
        this.alwaysVoiceButton.draw(tractCtx);
        this.autoWobbleButton.draw(tractCtx);
        this.aboutButton.draw(tractCtx);
        if (this.inAboutScreen) this.drawAboutScreen();
        else if (this.inInstructionsScreen) this.drawInstructionsScreen();
    },

    drawAboutScreen :  function()
    {
        var ctx = tractCtx;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "white";
        ctx.rect(0,0,600,600);
        ctx.fill();

        this.drawAboutText();
    },

    drawAboutText : function()
    {
        var ctx = tractCtx;
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#C070C6";
        ctx.strokeStyle = "#C070C6";
        ctx.font="50px Arial";
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        ctx.strokeText("P i n k   T r o m b o n e", 300, 230);
        ctx.fillText("P i n k   T r o m b o n e", 300, 230);

        ctx.font="28px Arial";
        ctx.fillText("bare-handed  speech synthesis", 300, 330);

        ctx.font="20px Arial";
        //ctx.fillText("(tap to start)", 300, 380);

        if (this.isFirefox)
        {
            ctx.font="20px Arial";
            ctx.fillText("(sorry - may work poorly with the Firefox browser)", 300, 430);
        }
    },

    drawInstructionsScreen :  function()
    {
        AudioSystem.mute();
        var ctx = tractCtx;
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "white";
        ctx.rect(0,0,600,600);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#C070C6";
        ctx.strokeStyle = "#C070C6";
        ctx.font="24px Arial";
        ctx.lineWidth = 2;
        ctx.textAlign = "center";

        ctx.font = "19px Arial";
        ctx.textAlign = "left";
        this.instructionsLine = 0;
        this.write("Sound is generated in the glottis (at the bottom left) then ");
        this.write("filtered by the shape of the vocal tract. The voicebox ");
        this.write("controls the pitch and intensity of the initial sound.");
        this.write("");
        this.write("Then, to talk:");
        this.write("");
        this.write("- move the body of the tongue to shape vowels");
        this.write("");
        this.write("- touch the oral cavity to narrow it, for fricative consonants");
        this.write("");
        this.write("- touch above the oral cavity to close it, for stop consonants");
        this.write("");
        this.write("- touch the nasal cavity to open the velum and let sound ");
        this.write("   flow through the nose.");
        this.write("");
        this.write("");
        this.write("(tap anywhere to continue)");

        ctx.textAlign = "center";
        ctx.fillText("[tap here to RESET]", 470, 535);

        this.instructionsLine = 18.8;
        ctx.textAlign = "left";
        this.write("Pink Trombone v1.1");
        this.write("by Neil Thapen");
        ctx.fillStyle = "blue";
        ctx.globalAlpha = 0.6;
        this.write("venuspatrol.nfshost.com");

        /*ctx.beginPath();
        ctx.rect(35, 535, 230, 35);
        ctx.rect(370, 505, 200, 50);
        ctx.fill();*/

        ctx.globalAlpha = 1.0;
    },

    instructionsScreenHandleTouch : function(x,y)
    {
        if ((x >=35 && x<=265) && (y>=535 && y<=570)) window.location.href = "http://venuspatrol.nfshost.com";
        else if ((x>=370 && x<=570) && (y>=505 && y<=555)) location.reload(false);
        else
        {
            UI.inInstructionsScreen = false;
            UI.aboutButton.switchedOn = true;
            AudioSystem.unmute();
        }
    },

    write : function(text)
    {
        tractCtx.fillText(text, 50, 100 + this.instructionsLine*22);
        this.instructionsLine += 1;
        if (text == "") this.instructionsLine -= 0.3;
    },

    buttonsHandleTouchStart : function(touch)
    {
        this.alwaysVoiceButton.handleTouchStart(touch);
        alwaysVoice = this.alwaysVoiceButton.switchedOn;
        this.autoWobbleButton.handleTouchStart(touch);
        autoWobble = this.autoWobbleButton.switchedOn;
        this.aboutButton.handleTouchStart(touch);

    },

    startTouches : function(event)
    {
        event.preventDefault();
        if (!AudioSystem.started)
        {
            AudioSystem.started = true;
            AudioSystem.startSound();
        }

        if (UI.inAboutScreen)
        {
            UI.inAboutScreen = false;
            return;
        }

        if (UI.inInstructionsScreen)
        {
            var touches = event.changedTouches;
            for (var j=0; j<touches.length; j++)
            {
                var x = (touches[j].pageX-UI.left_margin)/UI.width*600;
                var y = (touches[j].pageY-UI.top_margin)/UI.width*600;
            }
            UI.instructionsScreenHandleTouch(x,y);
            return;
        }


        var touches = event.changedTouches;
        for (var j=0; j<touches.length; j++)
        {
            var touch = {};
            touch.startTime = time;
            touch.endTime = 0;
            touch.fricative_intensity = 0;
            touch.alive = true;
            touch.id = touches[j].identifier;
            touch.x = (touches[j].pageX-UI.left_margin)/UI.width*600;
            touch.y = (touches[j].pageY-UI.top_margin)/UI.width*600;
            touch.index = TractUI.getIndex(touch.x, touch.y);
            touch.diameter = TractUI.getDiameter(touch.x, touch.y);
            UI.touchesWithMouse.push(touch);
            UI.buttonsHandleTouchStart(touch);
        }

        UI.handleTouches();
    },

    getTouchById : function(id)
    {
        for (var j=0; j<UI.touchesWithMouse.length; j++)
        {
            if (UI.touchesWithMouse[j].id == id && UI.touchesWithMouse[j].alive) return UI.touchesWithMouse[j];
        }
        return 0;
    },

    moveTouches : function(event)
    {
        var touches = event.changedTouches;
        for (var j=0; j<touches.length; j++)
        {
            var touch = UI.getTouchById(touches[j].identifier);
            if (touch != 0)
            {
                touch.x = (touches[j].pageX-UI.left_margin)/UI.width*600;
                touch.y = (touches[j].pageY-UI.top_margin)/UI.width*600;
                touch.index = TractUI.getIndex(touch.x, touch.y);
                touch.diameter = TractUI.getDiameter(touch.x, touch.y);
            }
        }
        UI.handleTouches();
    },

    endTouches : function(event)
    {
        var touches = event.changedTouches;
        for (var j=0; j<touches.length; j++)
        {
            var touch = UI.getTouchById(touches[j].identifier);
            if (touch != 0)
            {
                touch.alive = false;
                touch.endTime = time;
            }
        }
        UI.handleTouches();

        if (!UI.aboutButton.switchedOn)
        {
            UI.inInstructionsScreen = true;
        }
    },

    startMouse : function(event)
    {
        if (!AudioSystem.started)
        {
            AudioSystem.started = true;
            AudioSystem.startSound();
        }
        if (UI.inAboutScreen)
        {
            UI.inAboutScreen = false;
            return;
        }
        if (UI.inInstructionsScreen)
        {
            var x = (event.pageX-tractCanvas.offsetLeft)/UI.width*600;
            var y = (event.pageY-tractCanvas.offsetTop)/UI.width*600;
            UI.instructionsScreenHandleTouch(x,y);
            return;
        }

        var touch = {};
        touch.startTime = time;
        touch.fricative_intensity = 0;
        touch.endTime = 0;
        touch.alive = true;
        touch.id = "mouse"+Math.random();
        touch.x = (event.pageX-tractCanvas.offsetLeft)/UI.width*600;
        touch.y = (event.pageY-tractCanvas.offsetTop)/UI.width*600;
        touch.index = TractUI.getIndex(touch.x, touch.y);
        touch.diameter = TractUI.getDiameter(touch.x, touch.y);
        UI.mouseTouch = touch;
        UI.touchesWithMouse.push(touch);
        UI.buttonsHandleTouchStart(touch);
        UI.handleTouches();
    },

    moveMouse : function(event)
    {
        var touch = UI.mouseTouch;
        if (!touch.alive) return;
        touch.x = (event.pageX-tractCanvas.offsetLeft)/UI.width*600;
        touch.y = (event.pageY-tractCanvas.offsetTop)/UI.width*600;
        touch.index = TractUI.getIndex(touch.x, touch.y);
        touch.diameter = TractUI.getDiameter(touch.x, touch.y);
        UI.handleTouches();
    },

    endMouse : function(event)
    {
        var touch = UI.mouseTouch;
        if (!touch.alive) return;
        touch.alive = false;
        touch.endTime = time;
        UI.handleTouches();

        if (!UI.aboutButton.switchedOn) UI.inInstructionsScreen = true;
    },

    handleTouches : function(event)
    {
        TractUI.handleTouches();
        Glottis.handleTouches();
    },

    updateTouches : function()
    {
        var fricativeAttackTime = 0.1;
        for (var j=UI.touchesWithMouse.length-1; j >=0; j--)
        {
            var touch = UI.touchesWithMouse[j];
            if (!(touch.alive) && (time > touch.endTime + 1))
            {
                UI.touchesWithMouse.splice(j,1);
            }
            else if (touch.alive)
            {
                touch.fricative_intensity = Math.clamp((time-touch.startTime)/fricativeAttackTime, 0, 1);
            }
            else
            {
                touch.fricative_intensity = Math.clamp(1-(time-touch.endTime)/fricativeAttackTime, 0, 1);
            }
        }
    },

    shapeToFitScreen : function()
    {
        if (window.innerWidth <= window.innerHeight)
        {
            this.width = window.innerWidth-10;
            this.left_margin = 5;
            this.top_margin = 0.5*(window.innerHeight-this.width);
        }
        else
        {
            this.width = window.innerHeight-10;
            this.left_margin = 0.5*(window.innerWidth-this.width);
            this.top_margin = 5;
        }
        document.body.style.marginLeft = this.left_margin;
        document.body.style.marginTop = this.top_margin;
        tractCanvas.style.width = this.width;
        backCanvas.style.width = this.width;
    }
};
