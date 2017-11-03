"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class CarSprite extends pixi_js_1.Sprite {
    constructor(color) {
        super();
        this.HEIGHT = 50;
        this.WIDTH = 25;
        this.graphics = new pixi_js_1.Graphics();
        this.setColor(color);
    }
    setColor(color) {
        this.color = color;
        this.graphics.beginFill(color, 0.2);
        this.graphics.drawRect(0, 0, this.WIDTH, this.HEIGHT);
        this.graphics.lineStyle(2, color);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(this.WIDTH, 0);
        this.graphics.lineTo(this.WIDTH, this.HEIGHT);
        this.graphics.lineTo(0, this.HEIGHT);
        this.graphics.lineTo(0, 0);
        this.anchor.set(0.5, 0.5);
        this.pivot.set(this.WIDTH / 2, this.HEIGHT / 2);
        this.addChild(this.graphics);
    }
}
exports.default = CarSprite;
//# sourceMappingURL=car.js.map