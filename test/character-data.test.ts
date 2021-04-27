import {
    Text,
} from "../src";
import {expect} from 'chai';
import {describe} from "mocha";

describe('Character data manipulation', function () {
    it('append data', function () {
        const text = new Text('Greetings, fellow.');
        text.appendData(" How's it today?");
        expect(text.data).eq("Greetings, fellow. How's it today?");
    });

    it('insert data', function () {
        const text = new Text('Greetings, fellow.');
        text.insertData(11, 'my ');
        expect(text.data).eq('Greetings, my fellow.');
    });

    it('insert data with offset larger than length', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.insertData(19, 'my ')).to.throw('INDEX_SIZE_ERR');
    });

    it('insert data with negative offset', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.insertData(-1, 'my ')).to.throw('INDEX_SIZE_ERR');
    });

    it('delete data', function () {
        const text = new Text('Greetings, fellow.');
        text.deleteData(9, 8);
        expect(text.data).eq('Greetings.');
    });

    it('delete data with sum of offset and count larger than length', function () {
        const text = new Text('Greetings, fellow.');
        text.deleteData(9, 10);
        expect(text.data).eq('Greetings');
    });

    it('delete data with offset larger than length', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.deleteData(19, 1)).to.throw('INDEX_SIZE_ERR');
    });

    it('delete data with negative offset', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.deleteData(-1, 10)).to.throw('INDEX_SIZE_ERR');
    });

    it('replace data', function () {
        const text = new Text('Greetings, fellow.');
        text.replaceData(11, 6, 'sir');
        expect(text.data).eq('Greetings, sir.');
    });

    it('replace data with sum of offset and count larger than length', function () {
        const text = new Text('Greetings, fellow.');
        text.replaceData(11, 10, 'sir.');
        expect(text.data).eq('Greetings, sir.');
    });

    it('replace data with offset larger than length', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.replaceData(19, 1, 'sir')).to.throw('INDEX_SIZE_ERR');
    });

    it('replace data with negative offset', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.replaceData(-1, 10, 'sir')).to.throw('INDEX_SIZE_ERR');
    });

    it('substring data', function () {
        const text = new Text('Greetings, fellow.');
        const sub = text.substringData(11, 6);
        expect(sub).eq('fellow');
    });

    it('substring data with sum of offset and count larger than length', function () {
        const text = new Text('Greetings, fellow.');
        const sub = text.substringData(11, 10);
        expect(sub).eq('fellow.');
    });

    it('substring data with offset larger than length', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.substringData(19, 1)).to.throw('INDEX_SIZE_ERR');
    });

    it('substring data with negative offset', function () {
        const text = new Text('Greetings, fellow.');
        expect(() => text.substringData(-1, 10)).to.throw('INDEX_SIZE_ERR');
    });
});