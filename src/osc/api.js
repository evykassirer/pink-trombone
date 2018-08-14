const OSC = require('osc-js');

var OSCAPI = {  
    osc: new OSC(),

    init() {
        this.osc.open({
            port: 9000
        });
        this.bindGlottis();

        window.onunload = () => {
            this.osc.close({
                port: 9000
            });
            return true;
        }
    },

    bindGlottis() {
        this.osc.on('/glottis', message => {
            let key = message.args[0];
            let val = message.args[1];
            this.glottis[key] = val;
        });
    },
    glottis: {},
    tract: {},
}

export default OSCAPI;