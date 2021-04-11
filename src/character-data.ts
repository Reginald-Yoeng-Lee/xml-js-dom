import Node from "./node";

class CharacterData extends Node {

    set data(data) {
    }

    get data() {
        return '';
    }

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