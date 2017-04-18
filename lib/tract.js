/*
    read-only globals:

    sampleRate
 */
var Tract =
{
    n : 44,
    bladeStart : 10,
    tipStart : 32,
    lipStart : 39,
    R : [], //component going right
    L : [], //component going left
    reflection : [],
    junctionOutputR : [],
    junctionOutputL : [],
    maxAmplitude : [],
    diameter : [],
    restDiameter : [],
    targetDiameter : [],
    newDiameter : [],
    A : [],
    glottalReflection : 0.75,
    lipReflection : -0.85,
    lastObstruction : -1,
    fade : 1.0, //0.9999,
    movementSpeed : 15, //cm per second
    transients : [],
    lipOutput : 0,
    noseOutput : 0,
    velumTarget : 0.01,

    init : function()
    {
        this.bladeStart = Math.floor(this.bladeStart*this.n/44);
        this.tipStart = Math.floor(this.tipStart*this.n/44);
        this.lipStart = Math.floor(this.lipStart*this.n/44);
        this.diameter = new Float64Array(this.n);
        this.restDiameter = new Float64Array(this.n);
        this.targetDiameter = new Float64Array(this.n);
        this.newDiameter = new Float64Array(this.n);
        for (var i=0; i<this.n; i++)
        {
            var diameter = 0;
            if (i<7*this.n/44-0.5) diameter = 0.6;
            else if (i<12*this.n/44) diameter = 1.1;
            else diameter = 1.5;
            this.diameter[i] = this.restDiameter[i] = this.targetDiameter[i] = this.newDiameter[i] = diameter;
        }
        this.R = new Float64Array(this.n);
        this.L = new Float64Array(this.n);
        this.reflection = new Float64Array(this.n+1);
        this.newReflection = new Float64Array(this.n+1);
        this.junctionOutputR = new Float64Array(this.n+1);
        this.junctionOutputL = new Float64Array(this.n+1);
        this.A =new Float64Array(this.n);
        this.maxAmplitude = new Float64Array(this.n);

        this.noseLength = Math.floor(28*this.n/44)
        this.noseStart = this.n-this.noseLength + 1;
        this.noseR = new Float64Array(this.noseLength);
        this.noseL = new Float64Array(this.noseLength);
        this.noseJunctionOutputR = new Float64Array(this.noseLength+1);
        this.noseJunctionOutputL = new Float64Array(this.noseLength+1);
        this.noseReflection = new Float64Array(this.noseLength+1);
        this.noseDiameter = new Float64Array(this.noseLength);
        this.noseA = new Float64Array(this.noseLength);
        this.noseMaxAmplitude = new Float64Array(this.noseLength);
        for (var i=0; i<this.noseLength; i++)
        {
            var diameter;
            var d = 2*(i/this.noseLength);
            if (d<1) diameter = 0.4+1.6*d;
            else diameter = 0.5+1.5*(2-d);
            diameter = Math.min(diameter, 1.9);
            this.noseDiameter[i] = diameter;
        }
        this.newReflectionLeft = this.newReflectionRight = this.newReflectionNose = 0;
        this.calculateReflections();
        this.calculateNoseReflections();
        this.noseDiameter[0] = this.velumTarget;
    },

    reshapeTract : function(deltaTime)
    {
        var amount = deltaTime * this.movementSpeed; ;
        var newLastObstruction = -1;
        for (var i=0; i<this.n; i++)
        {
            var diameter = this.diameter[i];
            var targetDiameter = this.targetDiameter[i];
            if (diameter <= 0) newLastObstruction = i;
            var slowReturn;
            if (i<this.noseStart) slowReturn = 0.6;
            else if (i >= this.tipStart) slowReturn = 1.0;
            else slowReturn = 0.6+0.4*(i-this.noseStart)/(this.tipStart-this.noseStart);
            this.diameter[i] = Math.moveTowards(diameter, targetDiameter, slowReturn*amount, 2*amount);
        }
        if (this.lastObstruction>-1 && newLastObstruction == -1 && this.noseA[0]<0.05)
        {
            this.addTransient(this.lastObstruction);
        }
        this.lastObstruction = newLastObstruction;

        amount = deltaTime * this.movementSpeed;
        this.noseDiameter[0] = Math.moveTowards(this.noseDiameter[0], this.velumTarget,
                amount*0.25, amount*0.1);
        this.noseA[0] = this.noseDiameter[0]*this.noseDiameter[0];
    },

    calculateReflections : function()
    {
        for (var i=0; i<this.n; i++)
        {
            this.A[i] = this.diameter[i]*this.diameter[i]; //ignoring PI etc.
        }
        for (var i=1; i<this.n; i++)
        {
            this.reflection[i] = this.newReflection[i];
            if (this.A[i] == 0) this.newReflection[i] = 0.999; //to prevent some bad behaviour if 0
            else this.newReflection[i] = (this.A[i-1]-this.A[i]) / (this.A[i-1]+this.A[i]);
        }

        //now at junction with nose

        this.reflectionLeft = this.newReflectionLeft;
        this.reflectionRight = this.newReflectionRight;
        this.reflectionNose = this.newReflectionNose;
        var sum = this.A[this.noseStart]+this.A[this.noseStart+1]+this.noseA[0];
        this.newReflectionLeft = (2*this.A[this.noseStart]-sum)/sum;
        this.newReflectionRight = (2*this.A[this.noseStart+1]-sum)/sum;
        this.newReflectionNose = (2*this.noseA[0]-sum)/sum;
    },

    calculateNoseReflections : function()
    {
        for (var i=0; i<this.noseLength; i++)
        {
            this.noseA[i] = this.noseDiameter[i]*this.noseDiameter[i];
        }
        for (var i=1; i<this.noseLength; i++)
        {
            this.noseReflection[i] = (this.noseA[i-1]-this.noseA[i]) / (this.noseA[i-1]+this.noseA[i]);
        }
    },

    runStep : function(glottalOutput, turbulenceNoise, lambda)
    {
        var updateAmplitudes = (Math.random()<0.1);

        //mouth
        this.processTransients();
        this.addTurbulenceNoise(turbulenceNoise);

        //this.glottalReflection = -0.8 + 1.6 * Glottis.newTenseness;
        this.junctionOutputR[0] = this.L[0] * this.glottalReflection + glottalOutput;
        this.junctionOutputL[this.n] = this.R[this.n-1] * this.lipReflection;

        for (var i=1; i<this.n; i++)
        {
            var r = this.reflection[i] * (1-lambda) + this.newReflection[i]*lambda;
            var w = r * (this.R[i-1] + this.L[i]);
            this.junctionOutputR[i] = this.R[i-1] - w;
            this.junctionOutputL[i] = this.L[i] + w;
        }

        //now at junction with nose
        var i = this.noseStart;
        var r = this.newReflectionLeft * (1-lambda) + this.reflectionLeft*lambda;
        this.junctionOutputL[i] = r*this.R[i-1]+(1+r)*(this.noseL[0]+this.L[i]);
        r = this.newReflectionRight * (1-lambda) + this.reflectionRight*lambda;
        this.junctionOutputR[i] = r*this.L[i]+(1+r)*(this.R[i-1]+this.noseL[0]);
        r = this.newReflectionNose * (1-lambda) + this.reflectionNose*lambda;
        this.noseJunctionOutputR[0] = r*this.noseL[0]+(1+r)*(this.L[i]+this.R[i-1]);

        for (var i=0; i<this.n; i++)
        {
            this.R[i] = this.junctionOutputR[i]*0.999;
            this.L[i] = this.junctionOutputL[i+1]*0.999;

            //this.R[i] = Math.clamp(this.junctionOutputR[i] * this.fade, -1, 1);
            //this.L[i] = Math.clamp(this.junctionOutputL[i+1] * this.fade, -1, 1);

            if (updateAmplitudes)
            {
                var amplitude = Math.abs(this.R[i]+this.L[i]);
                if (amplitude > this.maxAmplitude[i]) this.maxAmplitude[i] = amplitude;
                else this.maxAmplitude[i] *= 0.999;
            }
        }

        this.lipOutput = this.R[this.n-1];

        //nose
        this.noseJunctionOutputL[this.noseLength] = this.noseR[this.noseLength-1] * this.lipReflection;

        for (var i=1; i<this.noseLength; i++)
        {
            var w = this.noseReflection[i] * (this.noseR[i-1] + this.noseL[i]);
            this.noseJunctionOutputR[i] = this.noseR[i-1] - w;
            this.noseJunctionOutputL[i] = this.noseL[i] + w;
        }

        for (var i=0; i<this.noseLength; i++)
        {
            this.noseR[i] = this.noseJunctionOutputR[i] * this.fade;
            this.noseL[i] = this.noseJunctionOutputL[i+1] * this.fade;

            //this.noseR[i] = Math.clamp(this.noseJunctionOutputR[i] * this.fade, -1, 1);
            //this.noseL[i] = Math.clamp(this.noseJunctionOutputL[i+1] * this.fade, -1, 1);

            if (updateAmplitudes)
            {
                var amplitude = Math.abs(this.noseR[i]+this.noseL[i]);
                if (amplitude > this.noseMaxAmplitude[i]) this.noseMaxAmplitude[i] = amplitude;
                else this.noseMaxAmplitude[i] *= 0.999;
            }
        }

        this.noseOutput = this.noseR[this.noseLength-1];

    },

    finishBlock : function()
    {
        this.reshapeTract(AudioSystem.blockTime);
        this.calculateReflections();
    },

    addTransient : function(position)
    {
        var trans = {}
        trans.position = position;
        trans.timeAlive = 0;
        trans.lifeTime = 0.2;
        trans.strength = 0.3;
        trans.exponent = 200;
        this.transients.push(trans);
    },

    processTransients : function()
    {
        for (var i = 0; i < this.transients.length; i++)
        {
            var trans = this.transients[i];
            var amplitude = trans.strength * Math.pow(2, -trans.exponent * trans.timeAlive);
            this.R[trans.position] += amplitude/2;
            this.L[trans.position] += amplitude/2;
            trans.timeAlive += 1.0/(sampleRate*2);
        }
        for (var i=this.transients.length-1; i>=0; i--)
        {
            var trans = this.transients[i];
            if (trans.timeAlive > trans.lifeTime)
            {
                this.transients.splice(i,1);
            }
        }
    },

    addTurbulenceNoise : function(turbulenceNoise)
    {
        for (var j=0; j<UI.touchesWithMouse.length; j++)
        {
            var touch = UI.touchesWithMouse[j];
            if (touch.index<2 || touch.index>Tract.n) continue;
            if (touch.diameter<=0) continue;
            var intensity = touch.fricative_intensity;
            if (intensity == 0) continue;
            this.addTurbulenceNoiseAtIndex(0.66*turbulenceNoise*intensity, touch.index, touch.diameter);
        }
    },

    addTurbulenceNoiseAtIndex : function(turbulenceNoise, index, diameter)
    {
        var i = Math.floor(index);
        var delta = index - i;
        turbulenceNoise *= Glottis.getNoiseModulator();
        var thinness0 = Math.clamp(8*(0.7-diameter),0,1);
        var openness = Math.clamp(30*(diameter-0.3), 0, 1);
        var noise0 = turbulenceNoise*(1-delta)*thinness0*openness;
        var noise1 = turbulenceNoise*delta*thinness0*openness;
        this.R[i+1] += noise0/2;
        this.L[i+1] += noise0/2;
        this.R[i+2] += noise1/2;
        this.L[i+2] += noise1/2;
    }
};
