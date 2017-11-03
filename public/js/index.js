"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const course_1 = require("./course");
const CourseRenderer_1 = require("./render/CourseRenderer");
const settings_1 = require("./settings");
const car_1 = require("./car");
new class Main {
    constructor() {
        this.course = [
            [50, 0, 150, 0],
            [50, -100, 150, -100],
            [50, -300, 150, -300],
            [50, -400, 150, -350],
            [150, -500, 250, -450],
            [150, -600, 250, -650],
            [50, -700, 150, -750],
            [-50, -800, 50, -850],
            [-50, -1000, 50, -950],
            [50, -1100, 150, -1050],
            [50, -1200, 150, -1200],
            [50, -1300, 150, -1300],
            [150, -1400, 250, -1400],
            [50, -1500, 150, -1500],
            [-50, -1600, 50, -1600],
            [50, -1700, 150, -1700],
            [50, -1900, 150, -1900],
            [0, -2000, 200, -2000],
            [0, -2200, 200, -2200],
            [50, -2300, 150, -2300],
            [50, -2400, 150, -2400],
            [75, -2500, 125, -2500],
            [75, -2700, 125, -2700],
            [50, -2800, 150, -2800],
            [50, -2900, 150, -2900],
            [50, -3100, 150, -3000],
            [150, -3100, 250, -3000],
            [150, -3200, 250, -3300],
            [100, -3200, 100, -3300],
            [-50, -3200, 50, -3300],
            [-50, -3500, 50, -3400],
            [50, -3500, 150, -3400],
            [50, -3600, 150, -3600]
        ];
        let settings = new settings_1.default();
        this.startSimulation(settings, settings.settings.entityAmount, this.course);
    }
    startSimulation(settings, carAmount, courseData) {
        let renderer = new CourseRenderer_1.default(settings);
        let course = new course_1.default(this.course);
        renderer.setCourse(course);
        let cars = [];
        for (let i = 0; i < carAmount; i++) {
            let car = new car_1.default(settings);
            car.position = { x: course.startingPosition.x, y: course.startingPosition.y };
            car.angle = course.startingAngle;
            cars.push(car);
        }
        renderer.app.ticker.add((delta) => {
            let callStack = [];
            let anyoneOutThere = false;
            for (let car of cars) {
                if (car.alive) {
                    anyoneOutThere = true;
                    callStack.push(delta, car.update(delta, course));
                }
            }
            if (!anyoneOutThere) {
                cars.forEach((car) => {
                    car.position = { x: course.startingPosition.x, y: course.startingPosition.y };
                    car.angle = course.startingAngle;
                    car.respawn();
                });
            }
            Promise.all([callStack]).then((v) => {
                renderer.updateCars(cars);
            });
        });
    }
};
//# sourceMappingURL=index.js.map