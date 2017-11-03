import { line } from "./components/line";
import { point } from "./components/point";
import * as dat from "dat-gui";

export default class Course {
    checkpoints: line[] = [];
    walls: line[] = [];

    startingPosition: point;
    startingAngle: number;

    finishPosition: point;

    test = { angle: 5 }


    constructor(checkpointData: number[][]) {
        //Convert from checkpointData to usable checkpoints. Format: {v1, v2, v3, v4} will be converted to {p1: {x: v1, y: v2}, p2: {x: v3, y: v4}}
        for (let line of checkpointData) {
            this.checkpoints.push({ p1: { x: line[0], y: line[1] }, p2: { x: line[2], y: line[3] } });
        }

        //We can then just use the checkpoint data to generate all our walls by connecting checkpoints
        for (var i = 1; i < this.checkpoints.length; ++i) //base index 1 to prevent going out of bounds
        {
            this.walls.push({ //Left side
                p1: this.checkpoints[i - 1].p1, p2: this.checkpoints[i].p1
            });

            this.walls.push({ //Right side
                p1: this.checkpoints[i - 1].p2, p2: this.checkpoints[i].p2
            });
        }

        //Set the middle of the first checkpoint to the starting position
        this.startingPosition = this.getCenter(this.checkpoints[0]);
        //Set the starting angle to face the center of the next checkpoint
        let secondCheckpointCenter = this.getCenter(this.checkpoints[1]);
        this.startingAngle = Math.atan2(secondCheckpointCenter.y - this.startingPosition.y, secondCheckpointCenter.x - this.startingPosition.x);

        this.finishPosition = this.getCenter(this.checkpoints[this.checkpoints.length - 1]);
    }

    getCenter(line: line): point {
        return { x: line.p1.x + (line.p2.x - line.p1.x) * 0.5, y: line.p1.y + (line.p2.y - line.p1.y) * 0.5 }
    }
}