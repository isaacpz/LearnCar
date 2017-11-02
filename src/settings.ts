import * as dat from "dat-gui";

export default class Settings {
    settings = {
        entityAmount: 30,
        stepAmount: 0.2,
        follow: true,
        renderSensors: false,
        zoom: 0.25
    }

    gui:dat.GUI;
    
    constructor() {
        this.gui = new dat.GUI();
        let entity = this.gui.addFolder("Entity Settings");
        entity.open();
        entity.add(this.settings, "entityAmount").name("Entity Amount").min(1).max(100);
        entity.add(this.settings, "stepAmount").name("Step Amount").min(0).max(1);

        let camera = this.gui.addFolder("Camera Settings");
        camera.open();
        camera.add(this.settings, "follow").name("Activate Camera?");
        camera.add(this.settings, "zoom").min(0.05).max(1).name("Zoom Level");

        let render = this.gui.addFolder("Render Settings");
        render.open();
        render.add(this.settings, "renderSensors").name("Show Sensors?");
    }
}