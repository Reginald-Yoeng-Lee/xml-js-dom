import {
    Document,
    Element,
} from "../src";
import {expect} from 'chai';

describe('Test nodes operations', function () {
    it('should document created with origin data', function () {
        const document = new Document();
        document.appendChild(new Element('main'));
        expect(document.origin).deep.equal({elements: [{name: 'main', elements: [], type: 'element'}]});
    });

    it('should every elements belong to a document can find their own document', function () {
        const document = new Document();
        const mainElement = new Element('main');
        document.appendChild(mainElement);
        expect(mainElement.ownerDocument).equal(document);

        const subElement = new Element('sub');
        mainElement.appendChild(subElement);
        expect(subElement.ownerDocument).equal(document);
    });
});