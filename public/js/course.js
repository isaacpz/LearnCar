"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Course {
    constructor(checkpointData) {
        this.checkpoints = [];
        this.walls = [];
        this.test = { angle: 5 };
        for (let line of checkpointData) {
            this.checkpoints.push({ p1: { x: line[0], y: line[1] }, p2: { x: line[2], y: line[3] } });
        }
        for (var i = 1; i < this.checkpoints.length; ++i) {
            this.walls.push({
                p1: this.checkpoints[i - 1].p1,
                p2: this.checkpoints[i].p1
            });
            this.walls.push({
                p1: this.checkpoints[i - 1].p2,
                p2: this.checkpoints[i].p2
            });
        }
        this.startingPosition = this.getCenter(this.checkpoints[0]);
        let secondCheckpointCenter = this.getCenter(this.checkpoints[1]);
        this.startingAngle = Math.atan2(secondCheckpointCenter.y - this.startingPosition.y, secondCheckpointCenter.x - this.startingPosition.x);
        this.finishPosition = this.getCenter(this.checkpoints[this.checkpoints.length - 1]);
    }
    getCenter(line) {
        return { x: line.p1.x + (line.p2.x - line.p1.x) * 0.5, y: line.p1.y + (line.p2.y - line.p1.y) * 0.5 };
    }
}
exports.default = Course;
//# sourceMappingURL=course.js.map