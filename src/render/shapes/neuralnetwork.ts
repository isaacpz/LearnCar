import { Sprite, Graphics, Point } from 'pixi.js';
import Brain from '../../brain/brain';

export default class NeuralNetworkSprite extends Sprite {

    graphics: Graphics;

    constructor(brain: Brain) {
        super();

        this.graphics = new Graphics();

        var positions:Point[][] = [];
        for (let i = 0; i < brain.topology.length; i++) {
            //Calculate position
            let amount = brain.topology[i];
            let y = (1.0 - (amount / 5.0)) * 150.0;
            let x = i * 50;
            positions.push([]);
            
            for (let j = 0; j < amount; j++) {
                positions[i][j] = new Point(x, y);
                //Draw connections if it's not the first layer
                if(i != 0) {
                    let connections: number[] = brain.connections[i - 1][j];
                    for(let z = 0; z < connections.length; z++) {
                        let color = 0x0000FF; //blue for positive 
                        if(connections[z] < 0) {
                            color = 0xFF0000; //red for negative
                        }

                        let width = Math.abs(connections[z]) * 10;
                        width = Math.max(1, Math.min(width, 10)); //1 <= width <= 10

                        this.graphics.lineStyle(width, color, 0.5);
                        this.graphics.moveTo(x, y);
                        let lastPoint = positions[i - 1][z];
                        this.graphics.lineTo(lastPoint.x, lastPoint.y);
                    }
                }

                y += 50;
            }
        }

        //Draw circles at end so they're on top
        for(let i = 0; i < positions.length; i++) {
            for(let j = 0; j < positions[i].length; j++) {
                let x = positions[i][j].x;
                let y = positions[i][j].y;
                //Draw neurons
                this.graphics.beginFill(0xF00d0F, 0.5);
                this.graphics.lineStyle(1, 0xF00d0F, 0.5);
                this.graphics.drawCircle(x, y, 10);
                this.graphics.beginFill(0x005929, 1);
                this.graphics.drawCircle(x, y, 8);
            }
        }

        this.addChild(this.graphics);
    }
}