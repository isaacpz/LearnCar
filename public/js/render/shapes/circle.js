"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class CircleSprite extends pixi_js_1.Sprite {
    constructor() {
        super();
        this.graphics = new pixi_js_1.Graphics();
        this.graphics.beginFill(0xF00d0F, 0.7);
        this.graphics.drawCircle(100, 100, 20);
        this.addChild(this.graphics);
    }
}
exports.default = CircleSprite;
//# sourceMappingURL=circle.js.map