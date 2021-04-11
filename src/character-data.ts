import Node from "./node";

abstract class CharacterData extends Node {

    abstract set data(data);

    abstract get data(): string;

    get length() {
        return this.data.length;
    }

    set nodeValue(val) {
        this.data = val;
    }

    get nodeValue() {
        return this.data;
    }

    appendData(data: string) {
        this.data += data;
    }

    getTextValue() {
        return this.data;
    }
}

export default CharacterData;