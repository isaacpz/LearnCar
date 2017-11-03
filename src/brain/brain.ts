import { layer } from '../components/brainlayer';

export default class Brain {
    topology:number[] = [5, 4, 3, 2]; //represents the amount of nodes in each layer (ie 5 input layers, 2 output layers)

    hiddenLayers:layer[] = []; //2d bc multiple hidden layers may exist
    outputLayer:layer = [];

    constructor(random:boolean = true) {
        this.generateInitialWeights(random);
    }

    generateInitialWeights(random:boolean) {
        let lastAmount:number = this.topology[0];
        for(let i = 1; i < this.topology.length; i++) { //For each hidden layer (which excludes first and last)
            let currentAmount:number = this.topology[i];
            let layer:layer = [];

            for(let j = 0; j < currentAmount; j++) {
                let connections:number[] = []; //This represents all the connections going to a single neuron
                for(let k = 0; k < lastAmount; k++) { //Each of the connections from the last layer gets a weight
                    let value = 0;
                    if(random)
                        value = Math.random() - Math.random(); //random -1 < val < 1
                    connections.push(value);
                }
                layer.push(connections);
            }
            this.hiddenLayers.push(layer);
            lastAmount = currentAmount;
        }
    }

    process(inputValues:number[]):number[] {
        let output:number[] = [];
        
        for(let i in this.hiddenLayers) {
            let currentLayer = this.hiddenLayers[i];
            let outputValues:number[] = [];
            for(let j in currentLayer) {
                let sum:number = 0;
                for(let k in inputValues) {
                    sum += inputValues[k] * currentLayer[j][k]; //Apply the modifier then add to the sum for the output
                }
                outputValues.push(sum);
                if(parseInt(i) == this.hiddenLayers.length - 1) { //if its the output layer, just output the values
                    output.push(sum);
                }
            }
            inputValues = outputValues; //For the next layer, input = output
        }

        return output;
    }
}