import * as dat from "dat-gui";

export default class Settings {
    settings = {
        stepAmount: 0.5,
        speed: 1,
        follow: true,
        renderSensors: false,
        zoom: 0.25,

        alphaClones: 5,
        breedAmount: 25,
        mutationChance: 0.13,
        mutationFactor: 0.25,
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

        let genetic = this.gui.addFolder("Genetic Settings");
        genetic.open();
        genetic.add(this.settings, "alphaClones").name("Alpha Clones").step(1);
        genetic.add(this.settings, "breedAmount").name("Breed Amount").min(1).step(1);
        genetic.add(this.settings, "mutationChance").name("Mutation Chance").min(0).max(1);
        genetic.add(this.settings, "mutationFactor").name("Mutation Factor").min(0).max(1);

        this.actions = this.gui.addFolder("Actions");
        this.actions.open();
    }
}