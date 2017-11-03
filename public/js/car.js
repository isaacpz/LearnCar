"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PhysicsUtil_1 = require("./physics/PhysicsUtil");
class Car {
    constructor(settings) {
        this.position = { x: 0, y: 0 };
        this.angle = 0;
        this.alive = true;
        this.color = 0x1000000 * Math.random();
        this.fitness = 0;
        this.health = 100;
        this.timeAlive = 0;
        this.trail = [];
        this.settings = settings;
    }
    respawn() {
        this.health = 100;
        this.timeAlive = 0;
        this.fitness = 0;
        this.color = 0x1000000 * Math.random();
        this.alive = true;
    }
    update(delta, course) {
        this.position.x += Math.cos(this.angle) * this.settings.settings.stepAmount * 8 * delta;
        this.position.y += Math.sin(this.angle) * this.settings.settings.stepAmount * 8 * delta;
        this.angle += ((Math.random() * 2) - 1) * 0.1;
        if (this.doesCollideWithWalls(course.walls)) {
            this.alive = false;
            this.color = 0xd8d8d8;
        }
    }
    doesCollideWithWalls(walls) {
        for (let wall of walls) {
            if (PhysicsUtil_1.default.doesLineCollideWithCircle(wall, this.position, 10)) {
                return true;
            }
        }
        return false;
    }
    getSensors() {
    }
}
exports.default = Car;
//# sourceMappingURL=car.js.map