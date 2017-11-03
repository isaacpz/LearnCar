"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dat = require("dat-gui");
class Settings {
    constructor() {
        this.settings = {
            entityAmount: 30,
            stepAmount: 0.2,
            follow: true,
            zoom: 0.25
        };
        this.gui = new dat.GUI();
        let entity = this.gui.addFolder("Entity Settings");
        entity.open();
        entity.add(this.settings, "entityAmount").name("Entity Amount").min(1).max(100);
        entity.add(this.settings, "stepAmount").name("Step Amount").min(0).max(1);
        entity.add(this.settings, "stepAmount").name("Sensor Amount").min(1).max(6);
        let camera = this.gui.addFolder("Camera Settings");
        camera.open();
        camera.add(this.settings, "follow").name("Activate Camera?");
        camera.add(this.settings, "zoom").min(0.05).max(1).name("Zoom Level");
    }
}
exports.default = Settings;
//# sourceMappingURL=settings.js.map