import { layer } from '../components/brainlayer';

export default class Brain {
    topology:number[] = [5, 4, 3, 2]; //represents the amount of nodes in each layer (ie 5 input layers, 2 output layers)

    hiddenLayers:layer[] = []; //2d bc multiple hidden layers may exist
    outputLayer:layer = [];

    constructor() {
        this.generateInitialWeights();
    }

    generateInitialWeights() {
        let lastAmount:number = this.topology[0];
        for(let i = 1; i < this.topology.length - 1; i++) { //For each hidden layer (which excludes first and last)
            let currentAmount:number = this.topology[i];
            let layer:layer = [];

            for(let j = 0; j < currentAmount; j++) {
                let connections:number[] = []; //This represents all the connections going to a single neuron
                for(let k = 0; k < lastAmount; k++) { //Each of the connections from the last layer gets a weight
                    connections.push(Math.random() - Math.random()); //random -1 < val < 1
                }
                layer.push(connections);
            }
            this.hiddenLayers.push(layer);
            lastAmount = currentAmount;
        }
        
        for(let i = 0; i < this.topology[this.topology.length - 1]; i++) { //For each of the output neurons
            let connections:number[] = [];
            for(let j = 0; j < lastAmount; j++) {
                connections.push(Math.random() - Math.random());
            }
            this.outputLayer.push(connections);
        }
    }

    process(inputValues:number[]):number[] {
        //hidden layers
        for(let currentLayer of this.hiddenLayers) {
            let outputValues:number[] = [];
            for(let j in currentLayer) {
                let sum:number = 0;
                for(let k in inputValues) {
                    sum += inputValues[k] * currentLayer[j][k]; //Apply the modifier then add to the sum for the output
                }
                outputValues.push(sum);
            }
            inputValues = outputValues; //For the next layer, input = output
        }

        let output:number[] = [];
        //output layer
        for(let i in this.outputLayer) {
            let sum:number = 0;
            for(let j in inputValues) {
                sum += inputValues[j] * this.outputLayer[i][j];
            }
            output.push(sum);
        }
        return output;
    }
}