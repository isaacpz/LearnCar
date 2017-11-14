import Course from "../course";
import Car from "../car";
import { Container, Application, ApplicationOptions, Point } from 'pixi.js';
import LinesSprite from "./shapes/lines";
import CircleSprite from "./shapes/circle";
import Settings from '../settings';
import CarSprite from "./shapes/car";
import SensorSprite from "./shapes/sensor";
import NeuralNetworkSprite from "./shapes/neuralnetwork";
import Brain from "../brain/brain";


export default class CourseRenderer {
    app: Application;
    settings: Settings;

    //Stage
    stage: PIXI.Container;

    //Components
    courseSprite: LinesSprite;
    checkpointsSprite: LinesSprite;
    neuralNetworkSprite: NeuralNetworkSprite;
    carSprites: CarSprite[] = [];
    sensorSprites: SensorSprite[] = [];

    //Camera tracking
    tracking: Car;

    applicationOptions: ApplicationOptions = {
        backgroundColor: 0xFFFFFF,
        antialias: true
    };


    constructor(settings: Settings) {
        this.settings = settings; //Save global settings

        //Create canvas
        this.app = new Application(window.innerWidth, window.innerHeight, this.applicationOptions);
        document.body.appendChild(this.app.view);
        this.stage = new PIXI.Container();
        this.app.stage.addChild(this.stage);

        window.onresize = (ev) => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        };
    }

    setCourse(course: Course) {
        if (this.courseSprite !== null) {
            this.stage.removeChild(this.courseSprite);
        }

        this.courseSprite = new LinesSprite(course.walls);
        this.stage.addChild(this.courseSprite);

        this.checkpointsSprite = new LinesSprite(course.checkpoints, 0xe8e8e8);
        this.stage.addChild(this.checkpointsSprite);
    }

    updateCars(cars: Car[]) {
        //Kill all sensor sprites bc they're always changing
        this.sensorSprites.forEach((sprite) => this.stage.removeChild(sprite));
        this.sensorSprites = [];

        //Make sure we have a sprite for each car
        if (this.carSprites.length != cars.length) {
            if (this.carSprites.length < cars.length) { //If too few, make more
                let deficit = cars.length - this.carSprites.length;
                for (let i = 0; i < deficit; i++) {
                    let sprite = new CarSprite(0x1000000 * Math.random());
                    this.stage.addChild(sprite);
                    this.carSprites.push(sprite);
                }
            } else { //Too many
                for (let i = 0; i < this.carSprites.length - cars.length; i++) {
                    this.carSprites.pop().destroy();
                }
            }
        }

        //For each car, update position, rotation, color, and sensors
        let sensorRendered: boolean = false;
        for (let i in cars) {
            let car = cars[i];
            let sprite = this.carSprites[i];
            sprite.position.set(car.position.x, car.position.y);
            sprite.rotation = car.angle + (Math.PI / 2);

            if (car.color != sprite.color) {
                sprite.graphics.clear();
                sprite.setColor(car.color);
            }
            //If car is alive, render sensors
            if (car.alive && this.settings.settings.renderSensors && !sensorRendered) {
                for (let sensor of car.sensors) {
                    let sensorSprite = new SensorSprite(sensor);
                    this.stage.addChild(sensorSprite);
                    this.sensorSprites.push(sensorSprite);
                }
                sensorRendered = true;
            }
        }

        this.setTopCar(cars);
        this.updateCamera();
        this.updateNeuralNetwork();
    }

    setTopCar(cars: Car[]) {
        //Find most fit living car
        let top: Car = cars[0];

        for (let car of cars) {
            if (car.alive) {
                if (car.fitness - 3 > top.fitness || !top.alive) {
                    top = car;
                }
            }
        }

        if (top !== this.tracking) {
            if (this.tracking == null || (!this.tracking.alive || top.fitness - 1 > this.tracking.fitness)) {
                this.tracking = top;

                //Reset neural network so it re-renders
                this.app.stage.removeChild(this.neuralNetworkSprite);
                this.neuralNetworkSprite = null;
            }
        }
    }

    updateNeuralNetwork() {
        if (this.settings.settings.renderNeuralNetwork) {
            if (this.neuralNetworkSprite == null) {
                this.neuralNetworkSprite = new NeuralNetworkSprite(this.tracking.brain);
                this.neuralNetworkSprite.position.set(50, 50);
                this.neuralNetworkSprite.scale.set(1.5, 1.5);
                this.app.stage.addChild(this.neuralNetworkSprite);
            }
        } else {
            if (this.neuralNetworkSprite != null) {
                this.app.stage.removeChild(this.neuralNetworkSprite);
                this.neuralNetworkSprite = null;
            }
        }
    }

    updateCamera() {
        //Set the camera on the tracking car
        let zoom = this.settings.settings.zoom * 10;
        this.stage.pivot.set(this.tracking.position.x - (window.innerWidth / (zoom * 2)), this.tracking.position.y - (window.innerHeight / (zoom * 2)));
        this.stage.scale.set(zoom, zoom);
    }
}