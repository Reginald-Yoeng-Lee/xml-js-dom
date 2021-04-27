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

    deleteData(offset: number, count: number) {
        this.replaceData(offset, count, '');
    }

    insertData(offset: number, data: string) {
        if (offset < 0 || offset > this.length) {
            throw new Error('INDEX_SIZE_ERR');
        }
        this.data = `${this.data.substring(0, offset)}${data}${this.data.substring(offset)}`;
    }

    replaceData(offset: number, count: number, data: string) {
        if (offset < 0 || offset > this.length || count < 0) {
            throw new Error('INDEX_SIZE_ERR');
        }
        this.data = `${this.data.substring(0, offset)}${data}${this.data.substring(offset + count)}`;
    }

    substringData(offset: number, count: number): string {
        if (offset < 0 || offset > this.length || count < 0) {
            throw new Error('INDEX_SIZE_ERR');
        }
        return this.data.substring(offset, offset + count);
    }

    getTextValue() {
        return this.data;
    }
}

export default CharacterData;