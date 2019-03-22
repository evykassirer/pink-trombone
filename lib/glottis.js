/*
    globals used:

    backCtx

    read-only globals:

    sampleRate
    autoWobble
    voiceOn
 */
var Glottis =
{
    timeInWaveform : 0,
    oldFrequency : 140,
    newFrequency : 140,
    UIFrequency : 140,
    smoothFrequency : 140,
    oldTenseness : 0.6,
    newTenseness : 0.6,
    UITenseness : 0.6,
    totalTime : 0,
    vibratoAmount : 0.005,
    vibratoFrequency : 6,
    intensity : 0,
    loudness : 1,
    isTouched : false,
    ctx : backCtx,
    touch : 0,
    x : 240,
    y : 530,

    keyboardTop : 500,
    keyboardLeft : 00,
    keyboardWidth : 600,
    keyboardHeight : 100,
    semitones : 20,
    marks : [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    baseNote : 87.3071, //F

    init : function(options)
    {
        this.setupWaveform(0);
        this.drawKeyboard();
    },

    drawKeyboard : function()
    {
        this.ctx.strokeStyle = palePink;
        this.ctx.fillStyle = palePink;
        backCtx.globalAlpha = 1.0;
        backCtx.lineCap = 'round';
        backCtx.lineJoin = 'round';

        var radius = 2;

        this.drawBar(0.0, 0.4, 8);
        backCtx.globalAlpha = 0.7;
        this.drawBar(0.52, 0.72, 8);

        backCtx.strokeStyle = "orchid";
        backCtx.fillStyle = "orchid";
        for (var i=0; i< this.semitones; i++)
        {
            var keyWidth = this.keyboardWidth/this.semitones;
            var x = this.keyboardLeft+(i+1/2)*keyWidth;
            var y = this.keyboardTop;
            if (this.marks[(i+3)%12]==1)
            {
                backCtx.lineWidth = 4;
                backCtx.globalAlpha = 0.4;
            }
            else
            {
                backCtx.lineWidth = 3;
                backCtx.globalAlpha = 0.2;
            }
            backCtx.beginPath();
            backCtx.moveTo(x,y+9);
            backCtx.lineTo(x, y+this.keyboardHeight*0.4-9);
            backCtx.stroke();

            backCtx.lineWidth = 3;
            backCtx.globalAlpha = 0.15;

            backCtx.beginPath();
            backCtx.moveTo(x,y+this.keyboardHeight*0.52+6);
            backCtx.lineTo(x, y+this.keyboardHeight*0.72-6);
            backCtx.stroke();

        }

        backCtx.fillStyle = "orchid";
        backCtx.font="17px Arial";
        backCtx.textAlign = "center";
        backCtx.globalAlpha = 0.7;
        backCtx.fillText("voicebox control", 300, 490);
        backCtx.fillText("pitch", 300, 592);
        backCtx.globalAlpha = 0.3;
        backCtx.strokeStyle = "orchid";
        backCtx.fillStyle = "orchid";
        backCtx.save()
        backCtx.translate(410, 587);
        this.drawArrow(80, 2, 10);
        backCtx.translate(-220, 0);
        backCtx.rotate(Math.PI);
        this.drawArrow(80, 2, 10);
        backCtx.restore();
        backCtx.globalAlpha=1.0;
    },

    drawBar : function(topFactor, bottomFactor, radius)
    {
        backCtx.lineWidth = radius*2;
        backCtx.beginPath();
        backCtx.moveTo(this.keyboardLeft+radius, this.keyboardTop+topFactor*this.keyboardHeight+radius);
        backCtx.lineTo(this.keyboardLeft+this.keyboardWidth-radius, this.keyboardTop+topFactor*this.keyboardHeight+radius);
        backCtx.lineTo(this.keyboardLeft+this.keyboardWidth-radius, this.keyboardTop+bottomFactor*this.keyboardHeight-radius);
        backCtx.lineTo(this.keyboardLeft+radius, this.keyboardTop+bottomFactor*this.keyboardHeight-radius);
        backCtx.closePath();
        backCtx.stroke();
        backCtx.fill();
    },

    drawArrow : function(l, ahw, ahl)
    {
        backCtx.lineWidth = 2;
        backCtx.beginPath();
        backCtx.moveTo(-l, 0);
        backCtx.lineTo(0,0);
        backCtx.lineTo(0, -ahw);
        backCtx.lineTo(ahl, 0);
        backCtx.lineTo(0, ahw);
        backCtx.lineTo(0,0);
        backCtx.closePath();
        backCtx.stroke();
        backCtx.fill();
    },

    handleTouches :  function()
    {
        if (this.touch != 0 && !this.touch.alive) this.touch = 0;

        if (this.touch == 0)
        {
            for (var j=0; j<UI.touchesWithMouse.length; j++)
            {
                var touch = UI.touchesWithMouse[j];
                if (!touch.alive) continue;
                if (touch.y<this.keyboardTop) continue;
                this.touch = touch;
            }
        }

        if (this.touch != 0)
        {
            var local_y = this.touch.y -  this.keyboardTop-10;
            var local_x = this.touch.x - this.keyboardLeft;
            local_y = Math.clamp(local_y, 0, this.keyboardHeight-26);
            var semitone = this.semitones * local_x / this.keyboardWidth + 0.5;
            Glottis.UIFrequency = this.baseNote * Math.pow(2, semitone/12);
            if (Glottis.intensity == 0) Glottis.smoothFrequency = Glottis.UIFrequency;
            //Glottis.UIRd = 3*local_y / (this.keyboardHeight-20);
            var t = Math.clamp(1-local_y / (this.keyboardHeight-28), 0, 1);
            Glottis.UITenseness = 1-Math.cos(t*Math.PI*0.5);
            Glottis.loudness = Math.pow(Glottis.UITenseness, 0.25);
            this.x = this.touch.x;
            this.y = local_y + this.keyboardTop+10;
        }
        Glottis.isTouched = (this.touch != 0);
    },

    runStep : function(lambda, noiseSource)
    {
        var timeStep = 1.0 / sampleRate;
        this.timeInWaveform += timeStep;
        this.totalTime += timeStep;
        if (this.timeInWaveform>this.waveformLength)
        {
            this.timeInWaveform -= this.waveformLength;
            this.setupWaveform(lambda);
        }
        var out = this.normalizedLFWaveform(this.timeInWaveform/this.waveformLength);
        var aspiration = this.intensity*(1-Math.sqrt(this.UITenseness))*this.getNoiseModulator()*noiseSource;
        aspiration *= 0.2 + 0.02*noise.simplex1(this.totalTime * 1.99);
        out += aspiration;
        return out;
    },

    getNoiseModulator : function()
    {
        var voiced = 0.1+0.2*Math.max(0,Math.sin(Math.PI*2*this.timeInWaveform/this.waveformLength));
        //return 0.3;
        return this.UITenseness* this.intensity * voiced + (1-this.UITenseness* this.intensity ) * 0.3;
    },

    finishBlock : function()
    {
        var vibrato = 0;
        vibrato += this.vibratoAmount * Math.sin(2*Math.PI * this.totalTime *this.vibratoFrequency);
        vibrato += 0.02 * noise.simplex1(this.totalTime * 4.07);
        vibrato += 0.04 * noise.simplex1(this.totalTime * 2.15);
        if (autoWobble)
        {
            vibrato += 0.2 * noise.simplex1(this.totalTime * 0.98);
            vibrato += 0.4 * noise.simplex1(this.totalTime * 0.5);
        }
        if (this.UIFrequency>this.smoothFrequency)
            this.smoothFrequency = Math.min(this.smoothFrequency * 1.1, this.UIFrequency);
        if (this.UIFrequency<this.smoothFrequency)
            this.smoothFrequency = Math.max(this.smoothFrequency / 1.1, this.UIFrequency);
        this.oldFrequency = this.newFrequency;
        this.newFrequency = this.smoothFrequency * (1+vibrato);
        this.oldTenseness = this.newTenseness;
        this.newTenseness = this.UITenseness
            + 0.1*noise.simplex1(this.totalTime*0.46)+0.05*noise.simplex1(this.totalTime*0.36);
        if (!this.isTouched && voiceOn) this.newTenseness += (3-this.UITenseness)*(1-this.intensity);

        if (this.isTouched || voiceOn) this.intensity += 0.13;
        else this.intensity -= 0.05;
        this.intensity = Math.clamp(this.intensity, 0, 1);
    },

    setupWaveform : function(lambda)
    {
        this.frequency = this.oldFrequency*(1-lambda) + this.newFrequency*lambda;
        var tenseness = this.oldTenseness*(1-lambda) + this.newTenseness*lambda;
        this.Rd = 3*(1-tenseness);
        this.waveformLength = 1.0/this.frequency;

        var Rd = this.Rd;
        if (Rd<0.5) Rd = 0.5;
        if (Rd>2.7) Rd = 2.7;
        var output;
        // normalized to time = 1, Ee = 1
        var Ra = -0.01 + 0.048*Rd;
        var Rk = 0.224 + 0.118*Rd;
        var Rg = (Rk/4)*(0.5+1.2*Rk)/(0.11*Rd-Ra*(0.5+1.2*Rk));

        var Ta = Ra;
        var Tp = 1 / (2*Rg);
        var Te = Tp + Tp*Rk; //

        var epsilon = 1/Ta;
        var shift = Math.exp(-epsilon * (1-Te));
        var Delta = 1 - shift; //divide by this to scale RHS

        var RHSIntegral = (1/epsilon)*(shift - 1) + (1-Te)*shift;
        RHSIntegral = RHSIntegral/Delta;

        var totalLowerIntegral = - (Te-Tp)/2 + RHSIntegral;
        var totalUpperIntegral = -totalLowerIntegral;

        var omega = Math.PI/Tp;
        var s = Math.sin(omega*Te);
        // need E0*e^(alpha*Te)*s = -1 (to meet the return at -1)
        // and E0*e^(alpha*Tp/2) * Tp*2/pi = totalUpperIntegral
        //             (our approximation of the integral up to Tp)
        // writing x for e^alpha,
        // have E0*x^Te*s = -1 and E0 * x^(Tp/2) * Tp*2/pi = totalUpperIntegral
        // dividing the second by the first,
        // letting y = x^(Tp/2 - Te),
        // y * Tp*2 / (pi*s) = -totalUpperIntegral;
        var y = -Math.PI*s*totalUpperIntegral / (Tp*2);
        var z = Math.log(y);
        var alpha = z/(Tp/2 - Te);
        var E0 = -1 / (s*Math.exp(alpha*Te));
        this.alpha = alpha;
        this.E0 = E0;
        this.epsilon = epsilon;
        this.shift = shift;
        this.Delta = Delta;
        this.Te=Te;
        this.omega = omega;
    },

    normalizedLFWaveform: function(t)
    {
        if (t>this.Te) output = (-Math.exp(-this.epsilon * (t-this.Te)) + this.shift)/this.Delta;
        else output = this.E0 * Math.exp(this.alpha*t) * Math.sin(this.omega * t);

        return output * this.intensity * this.loudness;
    }
};
