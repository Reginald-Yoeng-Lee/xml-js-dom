import {
    parse,
    Document,
    Element,
    Text,
    CDATASection,
    Comment,
    Namespace,
} from '../src';
import {expect} from 'chai';
import {describe} from "mocha";

describe('Test XML 2 DOM converting', function () {
    describe('Common node parser', function () {
        it('parse single node', function () {
            const document = parse('<main xmlns="http://app.com" />');
            const expected = generateDocument('main', {prefix: null, url: 'http://app.com'});
            expect(document?.origin).deep.eq(expected?.origin);
        });

        it('parse node with children', function () {
            const document = parse('<main><a /><b><b1 /></b><c /></main>');
            const expected = generateDocument();
            expected.root?.appendChild(new Element('a'));
            expected.root?.appendChild(new Element('b')).appendChild(new Element('b1'));
            expected.root?.appendChild(new Element('c'));
            expect(document?.origin).deep.eq(expected.origin);
        });

        it('parse node with children and attributes', function () {
            const document = parse('<main><a xa="1st" ya="2nd"><a1 za="3rd" /></a><b xb="4th" /></main>');
            const expected = generateDocument();
            expected.root?.appendChild(new Element('a')).appendChild(new Element('a1'));
            expected.root?.appendChild(new Element('b'));
            (<Element>expected.root?.firstChild).setAttribute('xa', '1st');
            (<Element>expected.root?.firstChild).setAttribute('ya', '2nd');
            (<Element>expected.root?.firstChild?.firstChild).setAttribute('za', '3rd');
            (<Element>expected.root?.lastChild).setAttribute('xb', '4th');
            expect(document?.origin).deep.eq(expected.origin);
        });
    });

    describe('Node with namespace', function () {
        it('different namespaces url between parent and child', function () {
            const document = <Document>parse('<main xmlns="http://app.com"><a xmlns="http://web.com" /></main>');
            expect(document.root?.getNamespace()).deep.eq({prefix: '', url: 'http://app.com'});
            expect((<Element>document.root?.firstChild).getNamespace()).deep.eq({prefix: '', url: 'http://web.com'});
        });

        it('different namespaces between parent and child', function () {
            const document = <Document>parse('<main xmlns="http://app.com"><web:a xmlns:web="http://web.com" /></main>');
            expect(document.root?.getNamespace()).deep.eq({prefix: '', url: 'http://app.com'});
            expect((<Element>document.root?.firstChild).getNamespace()).deep.eq({prefix: 'web', url: 'http://web.com'});
        });

        it('same namespace but different namespace declaration', function () {
            const document = <Document>parse('<main xmlns="http://app.com"><a xmlns:web="http://web.com" /></main>');
            expect(document.root?.getNamespace()).deep.eq({prefix: '', url: 'http://app.com'});
            expect((<Element>document.root?.firstChild).getNamespace()).deep.eq({prefix: '', url: 'http://app.com'});
            expect((<Element>document.root?.firstChild).getNamespaceUrl('web')).eq('http://web.com');
        });
    });

    describe('Text in DOM tree', function () {
        it('parse text and cdata', function () {
            const document = <Document>parse('<main>A<![CDATA[&<a/>]]></main>');
            expect(document.root?.firstChild instanceof Text).is.true;
            expect(document.root?.lastChild instanceof CDATASection).is.true;
        });

        it('parse text and cdata origin data', function () {
            const document = parse('<main><a>A</a><b>B<![CDATA[&<b/>]]></b><c><c1>C1</c1><c2>C2</c2></c></main>');
            expect(document?.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [{type: 'text', text: 'A'}],
                    }, {
                        name: 'b',
                        type: 'element',
                        elements: [{
                            type: 'text',
                            text: 'B',
                        }, {
                            type: 'cdata',
                            cdata: '&<b/>',
                        }],
                    }, {
                        name: 'c',
                        type: 'element',
                        elements: [{
                            name: 'c1',
                            type: 'element',
                            elements: [{type: 'text', text: 'C1'}],
                        }, {
                            name: 'c2',
                            type: 'element',
                            elements: [{type: 'text', text: 'C2'}],
                        }],
                    }],
                }],
            });
        });

        it('All text included in sub-tree', function () {
            const document = parse('<main>Begin<a>A</a><b>B<![CDATA[&<b/>]]></b><c><c1>C1</c1><c2>C2</c2></c></main>');
            expect(document?.getTextValue()).eq('BeginAB&<b/>C1C2');
        });

        it('Direct child text of element', function () {
            const root = (<Document>parse('<main>    Begin<a>A</a><b>B<![CDATA[&<b/>]]></b><c><c1>C1</c1><c2>C2</c2></c></main>')).root as Element;
            expect(root.text).eq('    Begin');
        });

        it('Direct child trimmed text of element', function () {
            const root = (<Document>parse('<main>    Begin<a>A</a><b>B<![CDATA[&<b/>]]></b><c><c1>C1</c1><c2>C2</c2></c></main>')).root as Element;
            expect(root.textTrim).eq('Begin');
        });
    });

    describe('Comment in DOM tree', function () {
        it('comment in the root level', function () {
            const document = parse('<!--Comment 1--><main><a /></main><!--Comment 2-->');
            const expected = generateDocument();
            expected.insertBefore(new Comment('Comment 1'), expected.root);
            expected.appendChild(new Comment('Comment 2'));
            expected.root?.appendChild(new Element('a'));
            expect(document?.origin).deep.eq(expected.origin);
        });

        it('single empty comment', function () {
            const document = parse('<main><!----></main>');
            expect(document?.origin).deep.eq(generateDocument()?.origin);
        });

        it('empty comment', function () {
            const document = parse('<main><!--a--><!----></main>');
            expect(document?.origin).deep.eq(generateDocument().root?.appendChild(new Comment('a')).ownerDocument?.origin);
        });

        it('multi line comment', function () {
            const document = parse(`
            <main>
            <a />
<!--<b />
<c />-->
</main>
            `);
            const expected = generateDocument();
            expected.root?.appendChild(new Element('a'));
            expected.root?.appendChild(new Comment('<b />\n<c />'));
            expect(document?.origin).deep.eq(expected.origin);
        });
    });

    describe('Instruction and declaration in DOM tree', function () {
        it('Single declaration and instruction', function () {
            const root = parse('<?xml version="1.0"?><main><?go?></main>');
            expect(root?.origin).deep.eq({
                declaration: {attributes: {version: '1.0'}},
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'go',
                        type: 'instruction',
                        instruction: '',
                    }],
                }],
            });
        });

        it('Delete declaration', function () {
            const root = <Document>parse('<?xml version="1.0"?><main><?go?></main>');
            root.declaration?.detach();
            expect(root?.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'go',
                        type: 'instruction',
                        instruction: '',
                    }],
                }],
            });
        });

        it('Delete instruction', function () {
            const root = <Document>parse('<?xml version="1.0"?><main><?go?></main>');
            root.root?.firstChild?.detach();
            expect(root.origin).deep.eq({
                declaration: {attributes: {version: '1.0'}},
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [],
                }],
            });
        });

        it('Change declaration attributes', function () {
            const root = <Document>parse('<?xml version="1.0"?><main><?go?></main>');
            root.declaration!.version = '1.1';
            root.declaration!.encoding = 'utf-16';
            root.declaration!.standalone = 'yes';
            expect(root.origin).deep.eq({
                declaration: {attributes: {version: '1.1', encoding: 'utf-16', standalone: 'yes'}},
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'go',
                        type: 'instruction',
                        instruction: '',
                    }],
                }],
            });
        });
    });
});

const generateDocument = (name = 'main', namespace?: Namespace | null): Document => {
    const root = <Element>new Document().appendChild(new Element('main'));
    namespace && root.setNamespace(namespace);
    return root.ownerDocument!;
};