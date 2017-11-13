import car from '../car';
import Brain from './brain';
import course from '../course';
import Settings from '../settings';
import ArrayUtil from '../util/ArrayUtil';

export default class Breeder {
    alphaCar: Brain;
    alphaCarFitness: number = -1;

    settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;
    }

    breed(cars: car[], course: course): car[] {
        let spawned: car[] = [];
        let sortedCars = this.getSortedCars(cars);

        //Calculate alpha car
        let bestCar = sortedCars[0];
        if (this.alphaCarFitness < bestCar.fitness) { //It becomes new alpha car if it's better than the best one we've ever seen
            this.alphaCar = bestCar.brain; //Save this cars' brain
            this.alphaCarFitness = bestCar.fitness; //and the performance 
            console.log("new alpha car!!!");
        }

        //Spawn alpha clones
        if (this.alphaCar != undefined) {
            for (let i = 0; i < this.settings.settings.alphaClones; i++) {
                let newCar = new car(this.settings, course);
                newCar.brain = new Brain(false);
                let cloneConnections = ArrayUtil.copy(this.alphaCar.connections);
                newCar.brain.connections = cloneConnections;

                this.mutate(newCar.brain);
                spawned.push(newCar);
            }
        }

        //Spawn bred cars
        let requiredAmount:number = this.settings.settings.breedAmount;

        //Calculate total fitness of top n cars
        let totalFitness:number = 0;
        for(let i = 0; i < this.settings.settings.selectionAmount; i++) {
            totalFitness += sortedCars[i].fitness;
        }

        for(let i = 0; i < this.settings.settings.selectionAmount; i++) {
            let current = sortedCars[i];
            //Spawn an amount of clones proportional to (this cars performance / top cars)
            let amount = (current.fitness / totalFitness) * requiredAmount;
            for(let j = 0; j < amount; j++) {
                let baby = new car(this.settings, course);
                baby.brain = new Brain(false);
                baby.brain.connections = ArrayUtil.copy(current.brain.connections);
                this.mutate(baby.brain);
                spawned.push(baby);
            }
        }
        
        return spawned;
    }

    mutate(brain: Brain) {
        for (let layer of brain.connections) {
            for (let weights of layer) {
                for (let i = 0; i < weights.length; i++) {
                    if (Math.random() > this.settings.settings.mutationChance) {
                        continue;
                    }

                    weights[i] += ((Math.random() - Math.random()) * this.settings.settings.mutationFactor);
                }
            }
        }


    }

    /*
    Sorts the cars by fitness
    */
    getSortedCars(cars: car[]): car[] {
        return cars.sort(function (a, b): number {
            return b.fitness - a.fitness;
        });
    }
}
