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

    breed(cars: car[], course:course): car[] {
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
                let hiddenLayers = ArrayUtil.copy(this.alphaCar.hiddenLayers);
                newCar.brain.hiddenLayers = hiddenLayers;

                this.mutate(newCar.brain);
                spawned.push(newCar);
            }
        }
        
        //Spawn bred cars
        let spawnedAmount:number = 0;
        let searchAmount:number = Math.floor(Math.sqrt(this.settings.settings.breedAmount));
        for(let i = 0; i < searchAmount; i++) {
            for(let j = 0; j < searchAmount; j++) {
                if(spawnedAmount >= this.settings.settings.breedAmount) {
                    break;
                }
                let baby1 = new car(this.settings, course);
                let baby2 = new car(this.settings, course);
                baby1.brain = new Brain(false);
                baby2.brain = new Brain(false);

                this.crossBreed(sortedCars[i], sortedCars[j], baby1, baby2);
                this.mutate(baby1.brain);
                this.mutate(baby2.brain);
                spawned.push(baby1);
                spawned.push(baby2);
                spawnedAmount+=2;
            }
        }
        return spawned;
    }

    crossBreed(parent1:car, parent2:car, baby1:car, baby2:car) {
        let totalWeights = parent1.brain.hiddenLayers.length;        
        let midPoint:number = Math.floor(Math.random() * totalWeights);

        //2 kids, each get 1/2 from parent
		for (let i = 0; i < midPoint; i++)
		{
			baby1.brain.hiddenLayers[i] = parent1.brain.hiddenLayers[i];
			baby2.brain.hiddenLayers[i] = parent2.brain.hiddenLayers[i];
		}
        for (let i = midPoint; i < totalWeights; i++)
		{
			baby1.brain.hiddenLayers[i] = parent2.brain.hiddenLayers[i];
			baby2.brain.hiddenLayers[i] = parent1.brain.hiddenLayers[i];
		}
    }

    mutate(brain:Brain) {
        if(Math.random() > this.settings.settings.mutationChance) {
            return;
        }
        for(let layer of brain.hiddenLayers) {
            for(let weights of layer) {
                for(let i = 0; i < weights.length; i++) {
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
