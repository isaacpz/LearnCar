import { Sprite, Graphics } from 'pixi.js';
import { line } from '../../components/line';

export default class CarSprite extends Sprite {
    HEIGHT:number = 50;
    WIDTH:number = 25;

    color:number;
    graphics: Graphics;
    

    constructor(color:number) { 
        super();

        this.graphics = new Graphics();
        
        this.setColor(color);
    }

    setColor(color:number) {
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