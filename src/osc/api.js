import Glottis from "../audio/glottis";
import TractUI from "../ui/tract-ui";

const OSC = require('osc-js');

var OSCAPI = {  
    osc: new OSC(),
    _prevNoteState: false,
    
    init() {
        this.osc.open({
            port: 9000
        });
        
        this.bindTouch();
        this.bindGlottis();
        this.bindTract();
        

        window.onunload = () => {
            this.osc.close({
                port: 9000
            });
            return true;
        }
    },
    bindTouch() {
        this.osc.on('/touch', message => {
            let key = message.args[0];
            let val = message.args[1];
            this.touch[key] = val;
            this.handleTouches();
        });
    },
    bindGlottis() {
        this.osc.on('/glottis', message => {
            let key = message.args[0];
            let val = message.args[1];
            this.glottis[key] = val;
        });
    },
    bindTract() {
        this.osc.on('/tract', message => {
            let key = message.args[0];
            if (key === 'diameter') {
                const diameter = message.args.splice(1);
                this.tract[key] = diameter;
            }
        });
    },
    handleTouches() {
        Glottis.touch = this.touch;
        Glottis.handleOSCParams();
        Glottis.handleOSCTouches();


        TractUI.handleOSCParams();

    },
    touch: {
        alive: false,
        diameter: 3, // 0 - 4
        // endTime: 1534610410.126,
        fricative_intensity: 0,
        // id: "mouse0.2884742858736995",
        // index: -25.89487282088425,
        // startTime: 1534610410.06,
        x: 0,
        y: 0
    },
    glottis: {},
    tract: {},
}

export default OSCAPI;