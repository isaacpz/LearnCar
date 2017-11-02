import Course from './course';
import CourseRenderer from './render/CourseRenderer';
import Settings from './settings';
import Car from './car';

new class Main {

    /*course = [
        [600, 450,   600, 550],
        [500, 450,   500, 550],
        [400, 450,   400, 550],
        [300, 450,   300, 550],
        [200, 450,   200, 550],

        [175, 425,   100, 500],

        [150, 400,   50, 400],
        [150, 300,   50, 300],
        [150, 200,   50, 200],

        [175, 175,   100, 75],

        [200, 175,   200, 50],

        [225, 175,   300, 75],
        [250, 200,   350, 200],
        [250, 300,   350, 300],
        [275, 375,   350, 300],

        [350, 400,   350, 300],
        [450, 400,   450, 300],

        [525, 375,   450, 300],
        [550, 300,   450, 300],
        [550, 200,   450, 200],
        [575, 175,   475, 75],

        [600, 175,   600, 50],

        [625, 175,   700, 75],

        [650, 200,   750, 200],
        [650, 300,   750, 300],
        [650, 400,   750, 400],
        [650, 550,   750, 550]
    ];*/

    course = [
        [ 50,     0,  150,     0],
        [ 50,  -100,  150,  -100],
        [ 50,  -300,  150,  -300],


        [ 50,  -400,  150,  -350],
        [150,  -500,  250,  -450],
        [150,  -600,  250,  -650],

        [ 50,  -700,  150,  -750],

        [-50,  -800,   50,  -850],
        [-50, -1000,   50,  -950],
        [ 50, -1100,  150, -1050],


        [ 50, -1200,  150, -1200],
        [ 50, -1300,  150, -1300],


        [150, -1400,  250, -1400],
        [ 50, -1500,  150, -1500],
        [-50, -1600,   50, -1600],
        [ 50, -1700,  150, -1700],

        [ 50, -1900,  150, -1900],

        [  0, -2000,  200, -2000],
        [  0, -2200,  200, -2200],
        [ 50, -2300,  150, -2300],

        [ 50, -2400,  150, -2400],

        [ 75, -2500,  125, -2500],
        [ 75, -2700,  125, -2700],
        [ 50, -2800,  150, -2800],

        [ 50, -2900,  150, -2900],




        [ 50,-3100,  150, -3000],
        [150,-3100,  250, -3000],
        [150,-3200,  250, -3300],

        [100,-3200,  100, -3300],

        [-50,-3200,   50, -3300],
        [-50,-3500,   50, -3400],
        [ 50,-3500,  150, -3400],

        [ 50,-3600,  150, -3600]

];

    constructor() {
        let settings = new Settings();
        this.startSimulation(settings, settings.settings.entityAmount, this.course);
    }

    startSimulation(settings:Settings, carAmount:number, courseData:number[][]) {
        //Create renderer
        let renderer = new CourseRenderer(settings);
        
        //Load course
        let course = new Course(this.course);
        renderer.setCourse(course);

        //Spawn initial cars
        let cars:Car[] = [];
        for(let i = 0; i < carAmount; i++) {
            let car = new Car(settings, course);
            car.position = {x: course.startingPosition.x, y: course.startingPosition.y};
            car.angle = course.startingAngle;
            cars.push(car);
        }
        
        renderer.app.ticker.add((delta) => {
            let callStack = [];
            let anyoneOutThere:boolean = false;
            for(let car of cars) {
                if(car.alive) {
                    anyoneOutThere = true;
                    callStack.push(car.update(delta, course));
                }
            }

            if(!anyoneOutThere) { //Everyone has died...
                cars.forEach((car) => {
                    car.position = {x: course.startingPosition.x, y: course.startingPosition.y};
                    car.angle = course.startingAngle;
                    car.respawn(course);
                });
            }

            Promise.all([callStack]).then((v) => {
                renderer.updateCars(cars);
            });
        })
    }
}