import {
    toXml,
    Document,
    Element,
    ElementBackingData,
    Namespace,
    Text,
    CDATASection,
    Comment,
} from "../src";
import {expect} from 'chai';
import {describe} from "mocha";

describe('Test DOM to XML converting', function () {
    describe('Node structure', function () {
        it('Single element with no child', function () {
            const el = generateRootElement('a');
            expect(toXml(el)).eq('<a />');
        });

        it('Multiple children order', function () {
            const el = generateRootElement();
            el.appendChild(new Element('a'));
            el.appendChild(new Element('b'));
            el.insertBefore(new Element('c'), el.lastChild);
            expect(toXml(el)).eq('<main><a /><c /><b /></main>');
        });

        it('Multiple children with text', function () {
            const el = generateRootElement();
            const a = new Element('a');
            const b = new Element('b');
            const c = new Element('c');
            el.appendChild(a);
            el.appendChild(b);
            el.appendChild(c);
            a.appendChild(new Text('Hello'));
            a.appendChild(new Element('a1'));
            a.appendChild(new Text('World'));
            c.appendChild(new CDATASection('Hello <math>'));
            c.appendChild(new Text(' ya'));
            expect(toXml(el)).eq('<main><a>Hello<a1 />World</a><b /><c><![CDATA[Hello <math>]]> ya</c></main>');
        });
    });

    describe('Attributes', function () {
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

        it('Element remove attribute', function () {
            const el = generateRootElement();
            el.setAttribute('x', 'first');
            el.setAttribute('y', 'second');
            el.setAttribute('z', 'third');
            el.removeAttribute('y');
            expect(toXml(el)).eq('<main x="first" z="third" />');
        });
    });

    describe('Namespace', function () {
        it('Predefined namespace', function () {
            const el = generateRootElement('main', {prefix: null, url: 'http://app.com'});
            expect(toXml(el)).eq('<main xmlns="http://app.com" />');
        });

        it('Predefined namespace with prefix', function () {
            const el = generateRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(toXml(el)).eq('<app:main xmlns:app="http://app.com" />');
        });

        it('Different parent and child namespace', function () {
            const {root} = prepareDifferentNamespaceTree({
                prefix: 'app',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            expect(toXml(root)).eq('<app:main xmlns:app="http://app.com"><web:a xmlns:web="http://web.com" /></app:main>');
        });

        it('Change child namespace as parent', function () {
            const {child} = prepareDifferentNamespaceTree({
                prefix: 'app',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            child.setNamespace({prefix: 'app', url: 'http://app.com'});
            expect(toXml(child)).eq('<app:main xmlns:app="http://app.com"><app:a /></app:main>');
        });

        it('Add child namespace', function () {
            const {child} = prepareDifferentNamespaceTree(null, null);
            child.setNamespace({prefix: 'web', url: 'http://web.com'});
            expect(toXml(child)).eq('<main><web:a xmlns:web="http://web.com" /></main>');
        });
    });

    describe('Comment', function () {
        it('Comment in the root level', function () {
            const document = new Document();
            document.appendChild(new Comment('Comment 1'));
            document.appendChild(new Element('main')).appendChild(new Element('a'));
            document.appendChild(new Comment('Comment 2'));
            expect(toXml(document)).eq('<!--Comment 1--><main><a /></main><!--Comment 2-->');
        });

        it('Comment as the only child', function () {
            const el = generateRootElement();
            el.appendChild(new Comment('Comment 1'));
            expect(toXml(el)).eq('<main><!--Comment 1--></main>');
        });

        it('Empty comment', function () {
            const el = generateRootElement();
            el.appendChild(new Comment(''));
            expect(toXml(el)).eq('<main><!----></main>');
        });
    });
});

const generateRootElement = (name: string | ElementBackingData = 'main', namespace?: Namespace | null): Element => {
    const el = <Element>new Document().appendChild(new Element(name));
    namespace && el.setNamespace(namespace);
    return el;
}

const prepareDifferentNamespaceTree = (parentNamespace: Namespace | null, childNamespace: Namespace | null) => {
    const el = generateRootElement('main', parentNamespace);
    const child = <Element>el.appendChild(new Element('a'));
    child.setNamespace(childNamespace);
    return {root: el, child};
};