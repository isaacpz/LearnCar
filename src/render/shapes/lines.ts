import { Sprite, Graphics } from 'pixi.js';
import { line } from '../../components/line';

//This is used mostly to render the entire course. We use 1 sprite for the entire course bc itll never move so we dont need each part of the course to be independent
export default class LinesSprite extends Sprite {

    graphics: Graphics;

    constructor(lines:line[], color:number = 0x000000) { 
        super();

        this.graphics = new Graphics();
        this.graphics.lineStyle(1, color);
        for(let line of lines) {
            this.graphics.moveTo(line.p1.x, line.p1.y);
            this.graphics.lineTo(line.p2.x, line.p2.y);
        }

        this.addChild(this.graphics);
    }
} 