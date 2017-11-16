import Course from './course';
import CourseRenderer from './render/CourseRenderer';
import Settings from './settings';
import Car from './car';
import Breeder from './brain/breeder';
import Brain from './brain/brain';
import JsonLoader from './util/JsonLoader';
import { GUIController } from 'dat-gui';

new class Main {
    constructor() {
        let settings = new Settings();
        this.startSimulation(settings, settings.settings.breedAmount + settings.settings.alphaClones);
    }

    async startSimulation(settings: Settings, carAmount: number) {
        //Create renderer
        let renderer = new CourseRenderer(settings);

        //Load course
        let courseData: number[][] = await new JsonLoader("courses/" + settings.settings.course + ".json");
        let course = new Course(courseData);
        renderer.setCourse(course);

        //Add course list
        let courses = await new JsonLoader("courses/courses.json");

        //Add course change menu handler
        settings.actions.add(settings.settings, "course", courses).onFinishChange(async function (value) {
            //Reset breeder/camera tracking
            breeder = new Breeder(settings);

            //Change course
            let courseData: number[][] = await new JsonLoader("courses/" + settings.settings.course + ".json");
            course = new Course(courseData);
            renderer.setCourse(course);
            renderer.clearCarSprites();

            for(let i in cars) {
                let oldCar = cars[i];
                let newCar = new Car(settings, course);
                newCar.brain = oldCar.brain;
                cars[i] = newCar;
            }
            renderer.tracking = cars[0];
        });

        //Spawn initial cars
        let cars: Car[] = [];
        for (let i = 0; i < carAmount; i++) {
            let car = new Car(settings, course);
            car.brain = new Brain();
            cars.push(car);
        }

        //Create breeder
        let breeder: Breeder = new Breeder(settings);

        //Add functionality to reset button
        settings.actions.add(settings.settings, "method").name("Reset Cars").fire = (): GUIController => {
            cars = [];
            breeder = new Breeder(settings);
            renderer.tracking = null;

            for (let i = 0; i < carAmount; i++) {
                let car = new Car(settings, course);
                car.brain = new Brain();
                cars.push(car);
            }
            return null;
        };


        //On tick
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