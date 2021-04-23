import {
    parse,
    Document,
    Element,
} from '../src';
import {expect} from 'chai';

describe('Test XML 2 DOM converting', function () {
    describe('Common node parser', function () {
        it('parse single node', function () {
            const document = parse('<main xmlns="http://app.com" />');
            const expected = new Document();
            (<Element>expected.appendChild(new Element('main'))).setNamespace({prefix: null, url: 'http://app.com'});
            expect(document?.origin).deep.eq(expected.origin);
        });
    });
});