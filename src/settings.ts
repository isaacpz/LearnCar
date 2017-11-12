import * as dat from "dat-gui";

export default class Settings {
    settings = {
        stepAmount: 0.25,
        speed: 1,
        follow: true,
        renderSensors: false,
        renderNeuralNetwork: true,
        zoom: 0.25,

        alphaClones: 5,
        breedAmount: 25,
        mutationChance: 0.9,
        mutationFactor: 0.02,
        method: function(){},
    }

    gui:dat.GUI;
    actions:dat.GUI;

    constructor() {
        this.gui = new dat.GUI();
        let entity = this.gui.addFolder("Entity Settings");
        entity.open();
        entity.add(this.settings, "speed").name("Speed").min(0).step(1);
        entity.add(this.settings, "stepAmount").min(0).max(1).name("Step Amount");        

         
        let camera = this.gui.addFolder("Camera Settings");
        camera.open();
        camera.add(this.settings, "follow").name("Activate Camera?");
        camera.add(this.settings, "zoom").min(0.05).max(1).name("Zoom Level");

        let render = this.gui.addFolder("Render Settings");
        render.open();
        render.add(this.settings, "renderSensors").name("Show Sensors?");
        render.add(this.settings, "renderNeuralNetwork").name("Render Network?");

        let genetic = this.gui.addFolder("Genetic Settings");
        genetic.open();
        genetic.add(this.settings, "alphaClones").name("Alpha Clones").step(1);
        genetic.add(this.settings, "breedAmount").name("Breed Amount").min(1).step(1);
        genetic.add(this.settings, "mutationChance").min(0).max(1).name("Mutate Chance");
        genetic.add(this.settings, "mutationFactor").min(0).max(1).name("Mutate Amount");

        this.actions = this.gui.addFolder("Actions");
        this.actions.open();
    }
}