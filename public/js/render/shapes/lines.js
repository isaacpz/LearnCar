"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class LinesSprite extends pixi_js_1.Sprite {
    constructor(lines) {
        super();
        this.graphics = new pixi_js_1.Graphics();
        this.graphics.lineStyle(1, 0x000000);
        for (let line of lines) {
            this.graphics.moveTo(line.p1.x, line.p1.y);
            this.graphics.lineTo(line.p2.x, line.p2.y);
        }
        this.addChild(this.graphics);
    }
}
exports.default = LinesSprite;
//# sourceMappingURL=lines.js.map