import { Sprite, Graphics } from 'pixi.js';

export default class CircleSprite extends Sprite {

    graphics: Graphics;

    constructor() { 
        super();

        this.graphics = new Graphics();
        this.graphics.beginFill(0xF00d0F, 0.7);
        this.graphics.drawCircle(100, 100, 20);

        this.addChild(this.graphics);
    }
}