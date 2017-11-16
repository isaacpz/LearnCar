import Deferred from "./Deferred";

export default class JsonLoader extends Deferred<any> {
    constructor(path: string) {
        super();
        let xhrObj = new XMLHttpRequest();
        let promise = this;
        xhrObj.open('GET', path, true);
        xhrObj.send();
        xhrObj.onreadystatechange = function () {
            promise.resolve(JSON.parse(this.responseText));
        }
    }
}