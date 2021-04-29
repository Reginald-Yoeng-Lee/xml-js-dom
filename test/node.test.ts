import {
    Document,
    Element,
    Text,
    CDATASection,
    Comment,
    ProcessingInstruction,
    Declaration,
    Namespace,
} from "../src";
import {expect} from 'chai';
import {describe} from "mocha";

describe('Test nodes operations', function () {
    describe('Origin data', function () {
        it('should document created with origin data', function () {
            const document = createDocumentWithRootElement();
            expect(document.origin).deep.equal({elements: [{name: 'main', elements: [], type: 'element'}]});
        });

        it('multiple children elements in order', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Element('a'));
            document.root?.appendChild(new Element('b'));
            document.root?.appendChild(new Element('c'));
            document.root?.firstChild?.appendChild(new Element('a1'));
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [{name: 'a1', type: 'element', elements: []}],
                    }, {
                        name: 'b',
                        type: 'element',
                        elements: [],
                    }, {
                        name: 'c',
                        type: 'element',
                        elements: [],
                    }],
                }],
            });
        });

        it('multiple children elements order - insertBefore', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Element('a'));
            document.root?.firstChild?.appendChild(new Element('a1'));
            document.root?.appendChild(new Element('b'));
            document.root?.insertBefore(new Element('c'), document.root?.lastChild);
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [{name: 'a1', type: 'element', elements: []}],
                    }, {
                        name: 'c',
                        type: 'element',
                        elements: [],
                    }, {
                        name: 'b',
                        type: 'element',
                        elements: [],
                    }],
                }],
            });
        });

        it('multiple children elements order - replaceChild', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Element('a'));
            document.root?.appendChild(new Element('b'));
            const bElement = document.root?.lastChild;
            document.root?.appendChild(new Element('c'));
            document.root?.replaceChild(new Element('d'), bElement!);
            document.root?.firstChild?.appendChild(new Element('a1'));
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [{name: 'a1', type: 'element', elements: []}],
                    }, {
                        name: 'd',
                        type: 'element',
                        elements: [],
                    }, {
                        name: 'c',
                        type: 'element',
                        elements: [],
                    }],
                }],
            });
        });

        it('multiple children elements order - removeChild', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Element('a'));
            document.root?.appendChild(new Element('b'));
            const bElement = document.root?.lastChild;
            document.root?.appendChild(new Element('c'));
            document.root?.removeChild(bElement!);
            document.root?.firstChild?.appendChild(new Element('a1'));
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [{name: 'a1', type: 'element', elements: []}],
                    }, {
                        name: 'c',
                        type: 'element',
                        elements: [],
                    }],
                }],
            });
        });
    });

    describe('Node accessor', function () {
        it('first child', function () {
            const {document, aElement} = prepareSiblingTest();
            expect(aElement).eq(document.root?.firstChild);
        });

        it('last child', function () {
            const {document, cElement} = prepareSiblingTest();
            expect(cElement).eq(document.root?.lastChild);
        });

        it('previous sibling', function () {
            const {aElement, bElement} = prepareSiblingTest();
            expect(aElement).eq(bElement.previousSibling);
        });

        it('next sibling', function () {
            const {bElement, cElement} = prepareSiblingTest();
            expect(cElement).eq(bElement.nextSibling);
        });

        it('previous sibling of first child', function () {
            const {aElement} = prepareSiblingTest();
            expect(aElement.previousSibling).eq(null);
        });

        it('next sibling of last child', function () {
            const {cElement} = prepareSiblingTest();
            expect(cElement.nextSibling).eq(null);
        });

        it('own document', function () {
            const document = createDocumentWithRootElement();
            const mainElement = document.root!;
            expect(mainElement.ownerDocument).equal(document);

            const subElement = new Element('sub');
            mainElement.appendChild(subElement);
            expect(subElement.ownerDocument).equal(document);
        });

        it('root element of document', function () {
            const document = new Document();
            document.appendChild(new Comment('Comment 1'));
            const mainElement = document.appendChild(new Element('main'));
            document.appendChild(new Comment('Comment 2'));
            expect(document.root).eq(mainElement);
        });
    });

    describe('Node manipulation', function () {
        it('clone node', function () {
            const document = createDocumentWithRootElement();
            const aElement = new Element('a');
            const bElement = new Element('b');
            const a1Element = new Element('a1');

            document.root?.appendChild(aElement);
            document.root?.appendChild(bElement);
            aElement.appendChild(new Text('Hello'));
            aElement.appendChild(a1Element);
            bElement.appendChild(new Text('Halo'));
            bElement.appendChild(new CDATASection('World<>'));
            bElement.appendChild(new Text('!'));

            const cloned = document.cloneNode(true);

            expect(cloned).deep.eq(document);
        });

        it('clone node with declaration and instruction', function () {
            const document = createDocumentWithRootElement();
            document.declaration = new Declaration({attributes: {version: '1.0', encoding: 'utf-8', standalone: 'no'}});

            const aElement = new Element('a');
            const bElement = new Element('b');
            const a1Element = new Element('a1');

            document.root?.appendChild(aElement);
            document.root?.appendChild(new ProcessingInstruction({name: 'go', instruction: 'from="root"'}))
            document.root?.appendChild(bElement);
            aElement.appendChild(new Text('Hello'));
            aElement.appendChild(a1Element);
            aElement.appendChild(new ProcessingInstruction({name: 'go', instruction: 'from="a"'}));
            bElement.appendChild(new Text('Halo'));
            bElement.appendChild(new CDATASection('World<>'));
            bElement.appendChild(new Text('!'));

            const cloned = document.cloneNode(true);

            expect(cloned).deep.eq(document);
        });
    });

    describe('Namespace', function () {
        it('predefine namespace attribute', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'app:main',
                    elements: [],
                    type: 'element',
                    attributes: {'xmlns:app': 'http://app.com'},
                }],
            });
        });

        it('predefine namespace prefix', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(document.root?.prefix).eq('app');
        });

        it('predefine namespace localName', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(document.root?.localName).eq('main');
        });

        it('predefine namespace tagName', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(document.root?.tagName).eq('app:main');
        });

        it('modified namespace prefix', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            document.root?.setNamespace({prefix: 'web', url: 'http://web.com'});
            expect(document.root?.prefix).eq('web');
        });

        it('modified namespace localName', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            document.root?.setNamespace({prefix: 'web', url: 'http://web.com'});
            expect(document.root?.localName).eq('main');
        });

        it('modified namespace tagName', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            document.root?.setNamespace({prefix: 'web', url: 'http://web.com'});
            expect(document.root?.tagName).eq('web:main');
        });

        it('non-prefix namespace tagName', function () {
            const document = createDocumentWithRootElement('main', {prefix: '', url: 'http://app.com'});
            expect(document.root?.tagName).eq('main');
        });

        it('change namespace prefix', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            document.root!.prefix = '';
            expect(document.root?.getNamespace()).is.null;
        });

        it('namespace fetching', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            expect(document.root?.getNamespace()).deep.eq({prefix: 'app', url: 'http://app.com'});
        });

        it('child same namespace fetching', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            const child = document.root?.appendChild(new Element('app:a'));
            expect((<Element>child).getNamespace()).deep.eq({prefix: 'app', url: 'http://app.com'});
        });

        it('child different namespace fetching', function () {
            const document = createDocumentWithRootElement('main', {prefix: 'app', url: 'http://app.com'});
            const child = document.root?.appendChild(new Element('a'));
            expect((<Element>child).getNamespace()).deep.eq(null);
        });

        it('extra namespace fetching', function () {
            const document = createDocumentWithRootElement('main', {prefix: '', url: 'http://app.com'});
            document.root?.setAttribute('xmlns:web', 'http://web.com');
            expect(document.root?.getNamespaceUrl('web')).eq('http://web.com');
        });

        it('child namespace fetching', function () {
            const {child} = prepareDifferentNamespacesTree({
                prefix: '',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            expect(child.getNamespace()).deep.eq({prefix: 'web', url: 'http://web.com'});
        });

        it('parent namespace with different child namespace', function () {
            const {document} = prepareDifferentNamespacesTree({
                prefix: '',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            expect(document.root?.getNamespace()).deep.eq({prefix: '', url: 'http://app.com'});
        });

        it('parent namespace with different child namespace origin', function () {
            const {document} = prepareDifferentNamespacesTree({
                prefix: '',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    attributes: {xmlns: 'http://app.com'},
                    elements: [{
                        name: 'web:a',
                        type: 'element',
                        elements: [],
                        attributes: {'xmlns:web': 'http://web.com'},
                    }],
                }],
            });
        });

        it('change child namespace with different parent namespace', function () {
            const {document, child} = prepareDifferentNamespacesTree({
                prefix: 'app',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            child.setNamespace({prefix: 'native', url: 'http://native.com'});
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'app:main',
                    type: 'element',
                    attributes: {'xmlns:app': 'http://app.com'},
                    elements: [{
                        name: 'native:a',
                        type: 'element',
                        attributes: {'xmlns:native': 'http://native.com'},
                        elements: [],
                    }],
                }],
            });
        });

        it('change child namespace url with different parent namespace', function () {
            const {document, child} = prepareDifferentNamespacesTree({
                prefix: 'app',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            child.setNamespace({prefix: 'web', url: 'http://native.com'});
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'app:main',
                    type: 'element',
                    attributes: {'xmlns:app': 'http://app.com'},
                    elements: [{
                        name: 'web:a',
                        type: 'element',
                        attributes: {'xmlns:web': 'http://native.com'},
                        elements: [],
                    }],
                }],
            });
        });

        it('change child namespace as parent\'s', function () {
            const {document, child} = prepareDifferentNamespacesTree({
                prefix: 'app',
                url: 'http://app.com',
            }, {prefix: 'web', url: 'http://web.com'});
            child.setNamespace({prefix: 'app', url: 'http://app.com'});
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'app:main',
                    type: 'element',
                    attributes: {'xmlns:app': 'http://app.com'},
                    elements: [{
                        name: 'app:a',
                        type: 'element',
                        elements: [],
                    }],
                }],
            });
        });
    });

    describe('Comment', function () {
        it('comment origin data', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Comment('Comment 1'));
            document.root?.appendChild(new Element('a')).appendChild(new Comment('Sub comment 1'));
            document.root?.appendChild(new Comment('Comment 2'));
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        type: 'comment',
                        comment: 'Comment 1',
                    }, {
                        name: 'a',
                        type: 'element',
                        elements: [{
                            type: 'comment',
                            comment: 'Sub comment 1',
                        }],
                    }, {
                        type: 'comment',
                        comment: 'Comment 2',
                    }],
                }],
            });
        });

        it('get element text without comment', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Text('Text'));
            document.root?.appendChild(new Comment('Comment'));
            document.root?.appendChild(new CDATASection('<CData />'));
            expect(document.root?.text).eq('Text<CData />');
        });

        it('get sub tree text without comment', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Text('Text'));
            const subEl = document.root?.appendChild(new Element('a'));
            subEl?.appendChild(new Text('Sub text'));
            subEl?.appendChild(new Comment('Comment'));
            expect(document.getTextValue()).eq('TextSub text');
        });
    });

    describe('Instruction and declaration', function () {
        it('declaration owner document is set', function () {
            const document = createDocumentWithRootElement();
            const declaration = new Declaration();
            document.declaration = declaration;
            expect(declaration.ownerDocument).eq(document);
        });

        it('declaration and instruction origin data', function () {
            const document = createDocumentWithRootElement();
            document.declaration = new Declaration({attributes: {version: '1.0', encoding: 'utf-8', standalone: 'yes'}});
            document.root?.appendChild(new Element('a'));
            document.root?.appendChild(new ProcessingInstruction({name: 'go', instruction: 'there'}));
            document.root?.appendChild(new Element('b'));
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [],
                    }, {
                        name: 'go',
                        instruction: 'there',
                        type: 'instruction',
                    }, {
                        name: 'b',
                        type: 'element',
                        elements: [],
                    }],
                }],
                declaration: {
                    attributes: {
                        version: '1.0',
                        encoding: 'utf-8',
                        standalone: 'yes',
                    },
                },
            });
        });

        it('declaration detach', function () {
            const document = createDocumentWithRootElement();
            const declaration = new Declaration();
            document.declaration = declaration;
            declaration.detach();
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [],
                }],
            });
            expect(declaration.parentNode).is.null;
        });

        it('instruction detach', function () {
            const document = createDocumentWithRootElement();
            document.root?.appendChild(new Element('a'));
            const instruction = document.root?.appendChild(new ProcessingInstruction({name: 'go', instruction: 'there'}));
            document.root?.appendChild(new Element('b'));
            instruction?.detach();
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [{
                        name: 'a',
                        type: 'element',
                        elements: [],
                    }, {
                        name: 'b',
                        type: 'element',
                        elements: [],
                    }],
                }],
            })
        });

        it('replace declaration', function () {
            const document = createDocumentWithRootElement();
            const oldDeclaration = new Declaration();
            document.declaration = oldDeclaration;
            document.declaration = new Declaration({attributes: {version: '1.1'}});
            expect(oldDeclaration.ownerDocument).is.null;
            expect(document.origin).deep.eq({
                elements: [{
                    name: 'main',
                    type: 'element',
                    elements: [],
                }],
                declaration: {attributes: {version: '1.1'}},
            });
        });
    });
});

const createDocumentWithRootElement = (name = 'main', namespace?: Namespace) => {
    const doc = new Document();
    doc.appendChild(new Element(name));
    namespace && doc.root?.setNamespace(namespace);
    return doc;
}

const prepareSiblingTest = () => {
    const document = createDocumentWithRootElement();

    const aElement = new Element('a');
    const bElement = new Element('b');
    const cElement = new Element('c');

    document.root?.appendChild(aElement);
    document.root?.appendChild(bElement);
    document.root?.appendChild(cElement);

    return {document, aElement, bElement, cElement};
};

const prepareDifferentNamespacesTree = (parentNamespace: Namespace, childNamespace: Namespace) => {
    const document = createDocumentWithRootElement('main', parentNamespace);
    const child = <Element>document.root?.appendChild(new Element('a'));
    child.setNamespace(childNamespace);
    return {document, child};
};