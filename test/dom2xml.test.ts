import {
    toXml,
    Document,
    Element,
    ElementBackingData,
} from "../src";
import {expect} from 'chai';

describe('Test DOM to XML converting', function () {
    it('Single element with no child', function () {
        const el = generateRootElement('a');
        expect(toXml(el)).eq('<a />');
    });

    it('Element attributes order', function () {
        const el = generateRootElement('a');
        el.setAttribute('x', 'first');
        el.setAttribute('y', 'second');
        expect(toXml(el)).eq('<a x="first" y="second" />');
    });

    it('Element attributes order', function () {
        const el = generateRootElement('a');
        el.setAttribute('y', 'first');
        el.setAttribute('x', 'second');
        expect(toXml(el)).eq('<a y="first" x="second" />');
    });
});

const generateRootElement = (name: string | ElementBackingData): Element => <Element>new Document().appendChild(new Element(name));