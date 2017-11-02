import Course from "../course";
import Car from "../car";
import { Container, Application, ApplicationOptions, Point } from 'pixi.js';
import LinesSprite from "./shapes/lines";
import CircleSprite from "./shapes/circle";
import Settings from '../settings';
import CarSprite from "./shapes/car";
import SensorSprite from "./shapes/sensor";


export default class CourseRenderer {
    app: Application;
    settings: Settings;

    //Components
    courseSprite: LinesSprite;
    checkpointsSprite: LinesSprite;
    carSprites: CarSprite[] = [];
    sensorSprites: SensorSprite[] = [];

    applicationOptions: ApplicationOptions = {
        backgroundColor: 0xFFFFFF,
        antialias: true
    };


    constructor(settings: Settings) {
        this.settings = settings; //Save global settings

        //Create canvas
        this.app = new Application(window.innerWidth, window.innerHeight, this.applicationOptions);
        document.body.appendChild(this.app.view);
        
        window.onresize = (ev) => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        };
    }

    setCourse(course: Course) {
        if (this.courseSprite !== null) {
            this.app.stage.removeChild(this.courseSprite);
        }

        this.courseSprite = new LinesSprite(course.walls);
        this.app.stage.addChild(this.courseSprite);

        this.checkpointsSprite = new LinesSprite(course.checkpoints, 0xe8e8e8);
        this.app.stage.addChild(this.checkpointsSprite);
    }

    updateCars(cars: Car[]) {
        //Kill all sensor sprites bc they're always changing
        this.sensorSprites.forEach((sprite) => this.app.stage.removeChild(sprite));
        this.sensorSprites = [];

        //Make sure we have a sprite for each car
        if (this.carSprites.length != cars.length) {
            if (this.carSprites.length < cars.length) { //If too few, make more
                let deficit = cars.length - this.carSprites.length;
                for (let i = 0; i < deficit; i++) {
                    let sprite = new CarSprite(0x1000000 * Math.random());
                    this.app.stage.addChild(sprite);
                    this.carSprites.push(sprite);
                }
            } else { //Too many
                for(let i = 0; i < this.carSprites.length - cars.length; i++) {
                    this.carSprites.pop().destroy();
                }
            }
        }

        //For each car, update position, rotation, color, and sensors
        let sensorRendered:boolean = false;
        for(let i in cars) {
            let car = cars[i];
            let sprite = this.carSprites[i];
            sprite.position.set(car.position.x, car.position.y);
            sprite.rotation = car.angle + (Math.PI / 2);

            if(car.color != sprite.color) {
                sprite.graphics.clear();
                sprite.setColor(car.color);
            }
            //If car is alive, render sensors
            if(car.alive && this.settings.settings.renderSensors && !sensorRendered) {
                for(let sensor of car.sensors) {
                    let sensorSprite = new SensorSprite(sensor);
                    this.app.stage.addChild(sensorSprite);
                    this.sensorSprites.push(sensorSprite);
                }
                sensorRendered = true;
            }
        }

        this.setCamera(cars);
    }

    setCamera(cars: Car[]) {
        if(!this.settings.settings.follow) {
            this.app.stage.pivot.set(0, 0);
            this.app.stage.scale.set(1, 1);
        } else {
            //Find first living car
            for(let car of cars) {
                if(car.alive) {
                    //Set the camera on them
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