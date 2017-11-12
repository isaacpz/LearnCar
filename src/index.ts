import Course from './course';
import CourseRenderer from './render/CourseRenderer';
import Settings from './settings';
import Car from './car';
import Breeder from './brain/breeder';
import Brain from './brain/brain';
import { GUIController } from 'dat-gui';

new class Main {

    course = [
        [600, 450, 600, 550],
        [500, 450, 500, 550],
        [400, 450, 400, 550],
        [300, 450, 300, 550],
        [200, 450, 200, 550],

        [175, 425, 100, 500],

        [150, 400, 50, 400],
        [150, 300, 50, 300],
        [150, 200, 50, 200],

        [175, 175, 100, 75],

        [200, 175, 200, 50],

        [225, 175, 300, 75],
        [250, 200, 350, 200],
        [250, 300, 350, 300],
        [275, 375, 350, 300],

        [350, 400, 350, 300],
        [450, 400, 450, 300],

        [525, 375, 450, 300],
        [550, 300, 450, 300],
        [550, 200, 450, 200],
        [575, 175, 475, 75],

        [600, 175, 600, 50],

        [625, 175, 700, 75],

        [650, 200, 750, 200],
        [650, 300, 750, 300],
        [650, 400, 750, 400],
        [650, 550, 750, 550]
    ];

    constructor() {
        let settings = new Settings();
        this.startSimulation(settings, settings.settings.breedAmount + settings.settings.alphaClones, this.course);
    }

    startSimulation(settings: Settings, carAmount: number, courseData: number[][]) {
        //Create renderer
        let renderer = new CourseRenderer(settings);

        //Load course
        let course = new Course(this.course);
        renderer.setCourse(course);

        //Spawn initial cars
        let cars: Car[] = [];
        for (let i = 0; i < carAmount; i++) {
            let car = new Car(settings, course);
            car.brain = new Brain();
            cars.push(car);
        }

        settings.actions.add(settings.settings, "method").name("Reset Cars").fire = (): GUIController => {
            cars = [];
            for (let i = 0; i < carAmount; i++) {
                let car = new Car(settings, course);
                car.brain = new Brain();
                cars.push(car);
            }
            return null;
        };

        let breeder: Breeder = new Breeder(settings);
        renderer.app.ticker.add((delta) => {
            let anyoneOutThere: boolean = false;
            for (let car of cars) {
                if (car.alive) {
                    anyoneOutThere = true;
                    for (let i = 0; i < settings.settings.speed; i++) {
                        car.update(delta, course);
                    }
                }
            }

            if (!anyoneOutThere) { //Everyone has died...
                cars = breeder.breed(cars, course);
            }

            let input: number[] = [];
            for (let sensor of cars[0].sensors) {
                input.push(sensor.distance);
            }

            renderer.updateCars(cars);
        })
    }
}