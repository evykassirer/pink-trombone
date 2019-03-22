/*
    globals used:

    tractCtx
    backCtx

    read-only globals:

    time
    tractCanvas
    alwaysVoice
 */
var TractUI =
{
    originX : 340,
    originY : 449,
    radius : 298,
    scale : 60,
    tongueIndex : 12.9,
    tongueDiameter : 2.43,
    innerTongueControlRadius : 2.05,
    outerTongueControlRadius : 3.5,
    tongueTouch : 0,
    angleScale : 0.64,
    angleOffset : -0.24,
    noseOffset : 0.8,
    gridOffset : 1.7,
    fillColour : 'pink',
    lineColour : '#C070C6',
    temp: {a:0, b:0},

    init : function()
    {
        this.ctx = tractCtx;
        this.setRestDiameter();
        for (var i=0; i<Tract.n; i++)
        {
            Tract.diameter[i] = Tract.targetDiameter[i] = Tract.restDiameter[i];
        }
        this.drawBackground();
        this.tongueLowerIndexBound = Tract.bladeStart+2;
        this.tongueUpperIndexBound = Tract.tipStart-3;
        this.tongueIndexCentre = 0.5*(this.tongueLowerIndexBound+this.tongueUpperIndexBound);
    },

    moveTo : function(i,d)
    {
        var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart-1);
        var wobble = (Tract.maxAmplitude[Tract.n-1]+Tract.noseMaxAmplitude[Tract.noseLength-1]);
        wobble *= 0.03*Math.sin(2*i-50*time)*i/Tract.n;
        angle += wobble;
        var r = this.radius - this.scale*d + 100*wobble;
        this.ctx.moveTo(this.originX-r*Math.cos(angle), this.originY-r*Math.sin(angle));
    },

    lineTo : function(i,d)
    {
        var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart-1);
        var wobble = (Tract.maxAmplitude[Tract.n-1]+Tract.noseMaxAmplitude[Tract.noseLength-1]);
        wobble *= 0.03*Math.sin(2*i-50*time)*i/Tract.n;
        angle += wobble;
        var r = this.radius - this.scale*d + 100*wobble;
        this.ctx.lineTo(this.originX-r*Math.cos(angle), this.originY-r*Math.sin(angle));
    },

    drawText : function(i,d,text)
    {
        var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart-1);
        var r = this.radius - this.scale*d;
        this.ctx.save();
        this.ctx.translate(this.originX-r*Math.cos(angle), this.originY-r*Math.sin(angle)+2); //+8);
        this.ctx.rotate(angle-Math.PI/2);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    },

    drawTextStraight : function(i,d,text)
    {
        var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart-1);
        var r = this.radius - this.scale*d;
        this.ctx.save();
        this.ctx.translate(this.originX-r*Math.cos(angle), this.originY-r*Math.sin(angle)+2); //+8);
        //this.ctx.rotate(angle-Math.PI/2);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    },

    drawCircle : function(i,d,radius)
    {
        var angle = this.angleOffset + i * this.angleScale * Math.PI / (Tract.lipStart-1);
        var r = this.radius - this.scale*d;
        this.ctx.beginPath();
        this.ctx.arc(this.originX-r*Math.cos(angle), this.originY-r*Math.sin(angle), radius, 0, 2*Math.PI);
        this.ctx.fill();
    },

    getIndex : function(x,y)
    {
        var xx = x-this.originX; var yy = y-this.originY;
        var angle = Math.atan2(yy, xx);
        while (angle> 0) angle -= 2*Math.PI;
        return (Math.PI + angle - this.angleOffset)*(Tract.lipStart-1) / (this.angleScale*Math.PI);
    },
    getDiameter : function(x,y)
    {
        var xx = x-this.originX; var yy = y-this.originY;
        return (this.radius-Math.sqrt(xx*xx + yy*yy))/this.scale;
    },

    draw : function()
    {
        this.ctx.clearRect(0, 0, tractCanvas.width, tractCanvas.height);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.drawTongueControl();
        this.drawPitchControl();

        var velum = Tract.noseDiameter[0];
        var velumAngle = velum * 4;

        //first draw fill
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.fillColour;
        this.ctx.fillStyle = this.fillColour;
        this.moveTo(1,0);
        for (var i = 1; i < Tract.n; i++) this.lineTo(i, Tract.diameter[i]);
        for (var i = Tract.n-1; i >= 2; i--) this.lineTo(i, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

        //for nose
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.fillColour;
        this.ctx.fillStyle = this.fillColour;
        this.moveTo(Tract.noseStart, -this.noseOffset);
        for (var i = 1; i < Tract.noseLength; i++) this.lineTo(i+Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i]*0.9);
        for (var i = Tract.noseLength-1; i >= 1; i--) this.lineTo(i+Tract.noseStart, -this.noseOffset);
        this.ctx.closePath();
        //this.ctx.stroke();
        this.ctx.fill();

        //velum
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.fillColour;
        this.ctx.fillStyle = this.fillColour;
        this.moveTo(Tract.noseStart-2, 0);
        this.lineTo(Tract.noseStart, -this.noseOffset);
        this.lineTo(Tract.noseStart+velumAngle, -this.noseOffset);
        this.lineTo(Tract.noseStart+velumAngle-2, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();



        //white text
        this.ctx.fillStyle = "white";
        this.ctx.font="20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.globalAlpha = 1.0;
        this.drawText(Tract.n*0.10, 0.425, "throat");
        this.drawText(Tract.n*0.71, -1.8, "nasal");
        this.drawText(Tract.n*0.71, -1.3, "cavity");
        this.ctx.font="22px Arial";
        this.drawText(Tract.n*0.6, 0.9, "oral");
        this.drawText(Tract.n*0.7, 0.9, "cavity");


        this.drawAmplitudes();

        //then draw lines
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = this.lineColour;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.moveTo(1, Tract.diameter[0]);
        for (var i = 2; i < Tract.n; i++) this.lineTo(i, Tract.diameter[i]);
        this.moveTo(1,0);
        for (var i = 2; i <= Tract.noseStart-2; i++) this.lineTo(i, 0);
        this.moveTo(Tract.noseStart+velumAngle-2,0);
        for (var i = Tract.noseStart+Math.ceil(velumAngle)-2; i < Tract.n; i++) this.lineTo(i, 0);
        this.ctx.stroke();

        //for nose
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = this.lineColour;
        this.ctx.lineJoin = 'round';
        this.moveTo(Tract.noseStart, -this.noseOffset);
        for (var i = 1; i < Tract.noseLength; i++) this.lineTo(i+Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i]*0.9);
        this.moveTo(Tract.noseStart+velumAngle, -this.noseOffset);
        for (var i = Math.ceil(velumAngle); i < Tract.noseLength; i++) this.lineTo(i+Tract.noseStart, -this.noseOffset);
        this.ctx.stroke();


        //velum
        this.ctx.globalAlpha = velum*5;
        this.ctx.beginPath();
        this.moveTo(Tract.noseStart-2, 0);
        this.lineTo(Tract.noseStart, -this.noseOffset);
        this.moveTo(Tract.noseStart+velumAngle-2, 0);
        this.lineTo(Tract.noseStart+velumAngle, -this.noseOffset);
        this.ctx.stroke();


        this.ctx.fillStyle = "orchid";
        this.ctx.font="20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.globalAlpha = 0.7;
        this.drawText(Tract.n*0.95, 0.8+0.8*Tract.diameter[Tract.n-1], " lip");

        this.ctx.globalAlpha=1.0;
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "left";
        this.ctx.fillText(UI.debugText, 20, 20);
        //this.drawPositions();
    },

    drawBackground : function()
    {
        this.ctx = backCtx;


        //text
        this.ctx.fillStyle = "orchid";
        this.ctx.font="20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.globalAlpha = 0.7;
        this.drawText(Tract.n*0.44, -0.28, "soft");
        this.drawText(Tract.n*0.51, -0.28, "palate");
        this.drawText(Tract.n*0.77, -0.28, "hard");
        this.drawText(Tract.n*0.84, -0.28, "palate");
        this.drawText(Tract.n*0.95, -0.28, " lip");

        this.ctx.font="17px Arial";
        this.drawTextStraight(Tract.n*0.18, 3, "  tongue control");
        this.ctx.textAlign = "left";
        this.drawText(Tract.n*1.03, -1.07, "nasals");
        this.drawText(Tract.n*1.03, -0.28, "stops");
        this.drawText(Tract.n*1.03, 0.51, "fricatives");
        //this.drawTextStraight(1.5, +0.8, "glottis")
        this.ctx.strokeStyle = "orchid";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.moveTo(Tract.n*1.03, 0); this.lineTo(Tract.n*1.07, 0);
        this.moveTo(Tract.n*1.03, -this.noseOffset); this.lineTo(Tract.n*1.07,  -this.noseOffset);
        this.ctx.stroke();
        this.ctx.globalAlpha = 0.9;
        this.ctx.globalAlpha = 1.0;
        this.ctx = tractCtx;
    },

    drawPositions : function()
    {
        this.ctx.fillStyle = "orchid";
        this.ctx.font="24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.globalAlpha = 0.6;
        var a = 2;
        var b = 1.5;
        this.drawText(15, a+b*0.60, 'æ'); //pat
        this.drawText(13, a+b*0.27, 'ɑ'); //part
        this.drawText(12, a+b*0.00, 'ɒ'); //pot
        this.drawText(17.7, a+b*0.05, '(ɔ)'); //port (rounded)
        this.drawText(27, a+b*0.65, 'ɪ'); //pit
        this.drawText(27.4, a+b*0.21, 'i'); //peat
        this.drawText(20, a+b*1.00, 'e'); //pet
        this.drawText(18.1, a+b*0.37, 'ʌ'); //putt
            //put ʊ
        this.drawText(23, a+b*0.1, '(u)'); //poot (rounded)
        this.drawText(21, a+b*0.6, 'ə'); //pert [should be ɜ]

        var nasals = -1.1;
        var stops = -0.4;
        var fricatives = 0.3;
        var approximants = 1.1;
        this.ctx.globalAlpha = 0.8;

        //approximants
        this.drawText(38, approximants, 'l');
        this.drawText(41, approximants, 'w');

        //?
        this.drawText(4.5, 0.37, 'h');

        if (Glottis.isTouched || alwaysVoice)
        {
            //voiced consonants
            this.drawText(31.5, fricatives, 'ʒ');
            this.drawText(36, fricatives, 'z');
            this.drawText(41, fricatives, 'v');
            this.drawText(22, stops, 'g');
            this.drawText(36, stops, 'd');
            this.drawText(41, stops, 'b');
            this.drawText(22, nasals, 'ŋ');
            this.drawText(36, nasals, 'n');
            this.drawText(41, nasals, 'm');
        }
        else
        {
            //unvoiced consonants
            this.drawText(31.5, fricatives, 'ʃ');
            this.drawText(36, fricatives, 's');
            this.drawText(41, fricatives, 'f');
            this.drawText(22, stops, 'k');
            this.drawText(36, stops, 't');
            this.drawText(41, stops, 'p');
            this.drawText(22, nasals, 'ŋ');
            this.drawText(36, nasals, 'n');
            this.drawText(41, nasals, 'm');
        }
    },

    drawAmplitudes : function()
    {
        this.ctx.strokeStyle = "orchid";
        this.ctx.lineCap = "butt";
        this.ctx.globalAlpha = 0.3;
        for (var i=2; i<Tract.n-1; i++)
        {
            this.ctx.beginPath();
            this.ctx.lineWidth = Math.sqrt(Tract.maxAmplitude[i])*3;
            this.moveTo(i, 0);
            this.lineTo(i, Tract.diameter[i]);
            this.ctx.stroke();
        }
        for (var i=1; i<Tract.noseLength-1; i++)
        {
            this.ctx.beginPath();
            this.ctx.lineWidth = Math.sqrt(Tract.noseMaxAmplitude[i]) * 3;
            this.moveTo(i+Tract.noseStart, -this.noseOffset);
            this.lineTo(i+Tract.noseStart, -this.noseOffset - Tract.noseDiameter[i]*0.9);
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    },

    drawTongueControl : function()
    {
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.strokeStyle = palePink;
        this.ctx.fillStyle = palePink;
        this.ctx.globalAlpha = 1.0;
        this.ctx.beginPath();
        this.ctx.lineWidth = 45;

        //outline
        this.moveTo(this.tongueLowerIndexBound, this.innerTongueControlRadius);
        for (var i=this.tongueLowerIndexBound+1; i<=this.tongueUpperIndexBound; i++) this.lineTo(i, this.innerTongueControlRadius);
        this.lineTo(this.tongueIndexCentre, this.outerTongueControlRadius);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

        var a = this.innerTongueControlRadius;
        var c = this.outerTongueControlRadius;
        var b = 0.5*(a+c);
        var r = 3;
        this.ctx.fillStyle = "orchid";
        this.ctx.globalAlpha = 0.3;
        this.drawCircle(this.tongueIndexCentre, a, r);
        this.drawCircle(this.tongueIndexCentre-4.25, a, r);
        this.drawCircle(this.tongueIndexCentre-8.5, a, r);
        this.drawCircle(this.tongueIndexCentre+4.25, a, r);
        this.drawCircle(this.tongueIndexCentre+8.5, a, r);
        this.drawCircle(this.tongueIndexCentre-6.1, b, r);
        this.drawCircle(this.tongueIndexCentre+6.1, b, r);
        this.drawCircle(this.tongueIndexCentre, b, r);
        this.drawCircle(this.tongueIndexCentre, c, r);

        this.ctx.globalAlpha = 1.0;

        //circle for tongue position
        var angle = this.angleOffset + this.tongueIndex * this.angleScale * Math.PI / (Tract.lipStart-1);
        var r = this.radius - this.scale*(this.tongueDiameter);
        var x = this.originX-r*Math.cos(angle);
        var y = this.originY-r*Math.sin(angle);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "orchid";
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.arc(x,y, 18, 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.globalAlpha = 0.15;
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;

        this.ctx.fillStyle = "orchid";
     },

    drawPitchControl : function()
    {
        var w=9;
        var h=15;
        if (Glottis.x)
        {
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = "orchid";
            this.ctx.globalAlpha = 0.7;
            this.ctx.beginPath();
            this.ctx.moveTo(Glottis.x-w, Glottis.y-h);
            this.ctx.lineTo(Glottis.x+w, Glottis.y-h);
            this.ctx.lineTo(Glottis.x+w, Glottis.y+h);
            this.ctx.lineTo(Glottis.x-w, Glottis.y+h);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.globalAlpha = 0.15;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }
    },

    setRestDiameter : function()
    {
        for (var i=Tract.bladeStart; i<Tract.lipStart; i++)
        {
            var t = 1.1 * Math.PI*(this.tongueIndex - i)/(Tract.tipStart - Tract.bladeStart);
            var fixedTongueDiameter = 2+(this.tongueDiameter-2)/1.5;
            var curve = (1.5-fixedTongueDiameter+this.gridOffset)*Math.cos(t);
            if (i == Tract.bladeStart-2 || i == Tract.lipStart-1) curve *= 0.8;
            if (i == Tract.bladeStart || i == Tract.lipStart-2) curve *= 0.94;
            Tract.restDiameter[i] = 1.5 - curve;
        }
    },

    handleTouches : function()
    {
        if (this.tongueTouch != 0 && !this.tongueTouch.alive) this.tongueTouch = 0;

        if (this.tongueTouch == 0)
        {
            for (var j=0; j<UI.touchesWithMouse.length; j++)
            {
                var touch = UI.touchesWithMouse[j];
                if (!touch.alive) continue;
                if (touch.fricative_intensity == 1) continue; //only new touches will pass this
                var x = touch.x;
                var y = touch.y;
                var index = TractUI.getIndex(x,y);
                var diameter = TractUI.getDiameter(x,y);
                if (index >= this.tongueLowerIndexBound-4 && index<=this.tongueUpperIndexBound+4
                    && diameter >= this.innerTongueControlRadius-0.5 && diameter <= this.outerTongueControlRadius+0.5)
                {
                    this.tongueTouch = touch;
                }
            }
        }

        if (this.tongueTouch != 0)
        {
            var x = this.tongueTouch.x;
            var y = this.tongueTouch.y;
            var index = TractUI.getIndex(x,y);
            var diameter = TractUI.getDiameter(x,y);
            var fromPoint = (this.outerTongueControlRadius-diameter)/(this.outerTongueControlRadius-this.innerTongueControlRadius);
            fromPoint = Math.clamp(fromPoint, 0, 1);
            fromPoint = Math.pow(fromPoint, 0.58) - 0.2*(fromPoint*fromPoint-fromPoint); //horrible kludge to fit curve to straight line
            this.tongueDiameter = Math.clamp(diameter, this.innerTongueControlRadius, this.outerTongueControlRadius);
            //this.tongueIndex = Math.clamp(index, this.tongueLowerIndexBound, this.tongueUpperIndexBound);
            var out = fromPoint*0.5*(this.tongueUpperIndexBound-this.tongueLowerIndexBound);
            this.tongueIndex = Math.clamp(index, this.tongueIndexCentre-out, this.tongueIndexCentre+out);
        }

        this.setRestDiameter();
        for (var i=0; i<Tract.n; i++) Tract.targetDiameter[i] = Tract.restDiameter[i];

        //other constrictions and nose
        Tract.velumTarget = 0.01;
        for (var j=0; j<UI.touchesWithMouse.length; j++)
        {
            var touch = UI.touchesWithMouse[j];
            if (!touch.alive) continue;
            var x = touch.x;
            var y = touch.y;
            var index = TractUI.getIndex(x,y);
            var diameter = TractUI.getDiameter(x,y);
            if (index > Tract.noseStart && diameter < -this.noseOffset)
            {
                Tract.velumTarget = 0.4;
            }
            this.temp.a = index;
            this.temp.b = diameter;
            if (diameter < -0.85-this.noseOffset) continue;
            diameter -= 0.3;
            if (diameter<0) diameter = 0;
            var width=2;
            if (index<25) width = 10;
            else if (index>=Tract.tipStart) width= 5;
            else width = 10-5*(index-25)/(Tract.tipStart-25);
            if (index >= 2 && index < Tract.n && y<tractCanvas.height && diameter < 3)
            {
                intIndex = Math.round(index);
                for (var i=-Math.ceil(width)-1; i<width+1; i++)
                {
                    if (intIndex+i<0 || intIndex+i>=Tract.n) continue;
                    var relpos = (intIndex+i) - index;
                    relpos = Math.abs(relpos)-0.5;
                    var shrink;
                    if (relpos <= 0) shrink = 0;
                    else if (relpos > width) shrink = 1;
                    else shrink = 0.5*(1-Math.cos(Math.PI * relpos / width));
                    if (diameter < Tract.targetDiameter[intIndex+i])
                    {
                        Tract.targetDiameter[intIndex+i] = diameter + (Tract.targetDiameter[intIndex+i]-diameter)*shrink;
                    }
                }
            }
        }
    },
};
