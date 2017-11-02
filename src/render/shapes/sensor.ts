import { Sprite, Graphics } from "pixi.js";
import { line } from "../../components/line";
import { sensor } from "../../components/sensor";

export default class SensorSprite extends Sprite {
    graphics: Graphics;

    constructor(sensor: sensor) {
        super();

        this.graphics = new Graphics();

        //Coordinates of the collision point
        let pos = {
            x: sensor.line.p1.x + (sensor.line.p2.x - sensor.line.p1.x) * sensor.distance,
            y: sensor.line.p1.y + (sensor.line.p2.y - sensor.line.p1.y) * sensor.distance
        };
        
        //Active part
        this.graphics.lineStyle(1, 0x015100, 0.9);
        this.graphics.moveTo(sensor.line.p1.x, sensor.line.p1.y);
        this.graphics.lineTo(pos.x, pos.y);

        //Remainder of the line
        this.graphics.lineStyle(1, 0x500005, 0.6);
        this.graphics.moveTo(pos.x, pos.y);
        this.graphics.lineTo(sensor.line.p2.x, sensor.line.p2.y);

        //X marks the spot
        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.moveTo(pos.x - 3, pos.y - 3);
        this.graphics.lineTo(pos.x + 3, pos.y + 3);

        this.graphics.moveTo(pos.x - 3, pos.y + 3);
        this.graphics.lineTo(pos.x + 3, pos.y - 3);

        this.addChild(this.graphics);
    }
}