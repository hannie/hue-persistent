'use strict';

const rest = require('restler'),
      argv = require('minimist')(process.argv.slice(2)),
      intervalMillis = 2000;

let HuePersistent = class {

    constructor(host, user) {
        this.baseUrl = `http://${host}/api/${user}`;
        this.lamps = [];

        setInterval(this.checkState.bind(this), intervalMillis);
    }

    checkState() {
        rest.get(this.baseUrl + '/lights').on('complete', (result) => {
            if (result instanceof Error) {
                console.error('Error:', result.message);
            } else {
                for(let lampIndex in result) {
                    let lamp = result[lampIndex],
                        currentState = lamp.state;

                    if(!this.lamps[lampIndex]) {
                        this.lamps[lampIndex] = {
                            savedState: currentState,
                        };
                    } else {
                        let previousState = this.lamps[lampIndex].state,
                            savedState = this.lamps[lampIndex].savedState;

                        // Check if the color is manually changed
                        if(!this.isColorDefaultState(currentState)) {
                            this.lamps[lampIndex].savedState = currentState;
                            savedState = currentState;
                        }

                        // Check if the color needs to be reset to the saved state
                        if(currentState.reachable &&
                           this.isColorChanged(currentState, savedState)) {
                             this.resetLamp(lampIndex, savedState);
                        }
                    }

                    this.lamps[lampIndex].state = currentState;
                }
            }
        });
    }

    isColorDefaultState(state) {
        let defaultColors = {
          bri: 254,
          hue: 8418,
          sat: 140,
        };
        return !this.isColorChanged(state, defaultColors);
    }

    isColorChanged(stateLeft, stateRight) {
        return JSON.stringify(this.getColorState(stateLeft)) !== JSON.stringify(this.getColorState(stateRight));
    }

    getColorState(state) {
        return {
          bri: state.bri,
          hue: state.hue,
          sat: state.sat,
        };
    }

    resetLamp(lampIndex, state) {
        let colorState = this.getColorState(state);
        console.log('Resetting lamp', lampIndex, colorState);
        rest.putJson(`${this.baseUrl}/lights/${lampIndex}/state`, colorState).on('complete', (data, response) => {
          // TODO handle failure
        });
    }
}

new HuePersistent(argv.host, argv.user);
