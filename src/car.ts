import { point } from "./components/point";
import Settings from "./settings";
import Course from "./course";
import { line } from "./components/line";
import PhysicsUtil from "./physics/PhysicsUtil";
import Brain from './brain/brain';
import { sensor } from "./components/sensor";

export default class Car {
    settings: Settings;

    /*
    Position Info
    */
    position: point = { x: 0, y: 0 }; //Their current position
    angle: number = 0; //Normalized angle of entity

    /*
    Brain
    */
    brain: Brain;

    /*
    Life Info
    */
    alive: boolean = true;
    health: number = 100; //The amount of ticks left until they die automatically (gets recharged by passing checkpoints)
    timeAlive: number = 0; //How many ticks they've survived
    fitness: number = 0; //Their current fitness score, calculated by how many checkpoints they've passed or how long it took them to complete the course    
    remainingCheckpoints:line[] = [];

    /*
    Rendering Info
    */
    color: number = 0x1000000 * Math.random(); //To let the renderer know to set this car gray 
    trail: point[] = []; //Records all the positions the car has visited so far
    sensors: sensor[] = [];

    constructor(settings: Settings, course: Course) {
        this.settings = settings;
        this.setCheckpoints(course);        

        this.position = {x: course.startingPosition.x, y: course.startingPosition.y};
        this.angle = course.startingAngle;
    }

    /*
    Tick
    */
    update(delta: number, course: Course) {
        if (!this.alive) //Dont do anything if we're dead
            return;

        this.timeAlive++;

        //Update senors
        this.sensors = this.processSensors(course.walls);

        //Process brain
        let input: number[] = [];
        for (let sensor of this.sensors) {
            input.push(sensor.distance);
        }
        let result: number[] = this.brain.process(input);

        //Set angle
        let angleDelta = result[0];
        this.angle += angleDelta * this.settings.settings.stepAmount * delta;

        //Set position
        let speed: number = result[1] * 30;
        speed = Math.min(15.0, Math.max(-10.0, speed)) //Constrain between -10 and 15 so we dont get too crazy
        this.position.x += Math.cos(this.angle) * speed * this.settings.settings.stepAmount * delta;
        this.position.y += Math.sin(this.angle) * speed * this.settings.settings.stepAmount * delta;

        /*
        Fitness rewards
        */
        this.processCheckpoints();

        /*
        Death scenerios
        */
        //Process wall collisions
        if (this.doesCollideWithWalls(course.walls)) {
            this.kill();
        }

        //Kill them if they've been alive too long
        if (this.health > 0)
            this.health--;
        if (this.health <= 0)
            this.kill();

    }

    /*
    Life
    */
    kill() {
        this.alive = false;
        this.color = 0xd8d8d8;
    }

    respawn(course:Course) {
        this.health = 100;
        this.timeAlive = 0;
        this.fitness = 0;
        this.color = 0x1000000 * Math.random();
        this.alive = true;
        this.setCheckpoints(course);
    }

    setCheckpoints(course: Course) {
        //Clone the checkpoints
        this.remainingCheckpoints = [];
        for(let current of course.checkpoints)
            this.remainingCheckpoints.push(current);
        this.remainingCheckpoints.splice(0, 1);
    }

    /*
    Physics & Collisions
    */
    doesCollideWithWalls(walls: line[]): boolean {
        for (let wall of walls) {
            if (PhysicsUtil.doesLineCollideWithCircle(wall, this.position, 10)) {
                return true;
            }
        }
        return false;
    }

    processSensors(walls: line[]): sensor[] {
        let sensors: sensor[] = [];

        const angles: number[] = [
            Math.PI / 4,
            Math.PI / 2,
            0,
            -Math.PI / 2,
            -Math.PI / 4
        ];

        for (let angle of angles) {
            let sensor = {
                line: {
                    p1: { x: this.position.x, y: this.position.y },
                    p2: { x: this.position.x + 100 * Math.cos(angle), y: this.position.y + 100 * Math.sin(angle) }
                },
                distance: 1
            };

            sensor.line.p1 = PhysicsUtil.rotateVec2(sensor.line.p1, this.position, this.angle);
            sensor.line.p2 = PhysicsUtil.rotateVec2(sensor.line.p2, this.position, this.angle);

            //Find distance from walls
            for (let wall of walls) {
                var v = PhysicsUtil.getPartialSegmentCollisionDistance(sensor.line.p1, sensor.line.p2, wall.p1, wall.p2);

                if (v >= 0.0 && v < 1.0 && sensor.distance > v)
                    sensor.distance = v;
            }
            sensors.push(sensor);
        }
        return sensors;
    }
    
    processCheckpoints() {
        let i:number = 0;
        while(i < this.remainingCheckpoints.length) { //use this weird loop so we can remove without skipping values
            let checkpoint = this.remainingCheckpoints[i];
            if(PhysicsUtil.doesLineCollideWithCircle(checkpoint, this.position, 15)) {
                this.remainingCheckpoints.splice(i, 1); //Remove this checkpoint so it doesnt get double counted
                this.health = 100; //Give them more life
                this.fitness++; //Give them more fitness
            } else {
                i++;
            }
        }
        if(this.remainingCheckpoints.length == 0) { //They finished the course!
            //Fitness is based on time taken now.
            this.fitness += (1000.0 / this.timeAlive);
            this.kill();
        }
    }
}