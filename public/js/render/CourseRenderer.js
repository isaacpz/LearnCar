"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const lines_1 = require("./shapes/lines");
const car_1 = require("./shapes/car");
class CourseRenderer {
    constructor(settings) {
        this.carSprites = [];
        this.applicationOptions = {
            backgroundColor: 0xFFFFFF,
            antialias: true
        };
        this.settings = settings;
        this.app = new pixi_js_1.Application(window.innerWidth, window.innerHeight, this.applicationOptions);
        document.body.appendChild(this.app.view);
        window.onresize = (ev) => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        };
    }
    setCourse(course) {
        if (this.courseSprite !== null) {
            this.app.stage.removeChild(this.courseSprite);
        }
        this.courseSprite = new lines_1.default(course.walls);
        this.app.stage.addChild(this.courseSprite);
    }
    updateCars(cars) {
        if (this.carSprites.length != cars.length) {
            if (this.carSprites.length < cars.length) {
                let deficit = cars.length - this.carSprites.length;
                for (let i = 0; i < deficit; i++) {
                    let sprite = new car_1.default(0x1000000 * Math.random());
                    this.app.stage.addChild(sprite);
                    this.carSprites.push(sprite);
                }
            }
            else {
                for (let i = 0; i < this.carSprites.length - cars.length; i++) {
                    this.carSprites.pop().destroy();
                }
            }
        }
        for (let i in cars) {
            let car = cars[i];
            let sprite = this.carSprites[i];
            sprite.position.set(car.position.x, car.position.y);
            sprite.rotation = car.angle + (Math.PI / 2);
            if (car.color != sprite.color) {
                sprite.graphics.clear();
                sprite.setColor(car.color);
            }
        }
        this.setCamera(cars);
    }
    setCamera(cars) {
        if (!this.settings.settings.follow) {
            this.app.stage.pivot.set(0, 0);
            this.app.stage.scale.set(1, 1);
        }
        else {
            for (let car of cars) {
                if (car.alive) {
                    let zoom = this.settings.settings.zoom * 10;
                    this.app.stage.pivot.set(car.position.x - (window.innerWidth / (zoom * 2)), car.position.y - (window.innerHeight / (zoom * 2)));
                    this.app.stage.scale.set(zoom, zoom);
                    return;
                }
            }
        }
    }
    update() {
    }
}
exports.default = CourseRenderer;
//# sourceMappingURL=CourseRenderer.js.map