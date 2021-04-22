import xmlConverter, {Options} from '@reginaldlee/xml-js';

import Node from "./node";
export {Node};
export {default as Document} from "./document";
export {default as Element} from "./element";
export {default as NodeGroup} from "./node-group";
export {default as Attr} from "./attr";
export {default as CharacterData} from "./character-data";
export {default as Text} from "./text";
export {default as CDATASection} from "./cdata-section";

import DefaultNodeFactory from "./node-factory/default-node-factory";
import NodeFactory from "./node-factory/node-factory";

export {default as Namespace} from './namespace';

export {NodeFactory};
export {default as NodeFactoryGroup} from './node-factory/node-factory-group';
export {default as DocumentFactory} from './node-factory/document-factory';
export {default as ElementFactory} from './node-factory/element-factory';
export {default as TextFactory} from './node-factory/text-factory';
export {default as CDATASectionFactory} from './node-factory/cdata-section-factory';
export {DefaultNodeFactory};

import BackingData from "./backing-data/backing-data";
export type {BackingData};
export type {default as NodeGroupBackingData} from './backing-data/node-group-backing-data';
export type {default as ElementBackingData} from './backing-data/element-backing-data';
export type {default as AttrBackingData} from './backing-data/attr-backing-data';
export type {default as TextBackingData} from './backing-data/text-backing-data';
export type {default as CDATABackingData} from './backing-data/cdata-backing-data';

export interface ParsingOptions extends Options.XML2JS {
    nodeFactory?: NodeFactory;
}

export const parse = (xml: string, opts: ParsingOptions = {}) => {
    const obj = xmlConverter.xml2js(xml, opts);

    const nodeFactory = opts.nodeFactory || new DefaultNodeFactory();

    return nodeFactory.parseNode(obj, nodeFactory, null);
};

export const toXml = (node: Node | BackingData, opts: Options.JS2XML = {}) => {
    let obj = node instanceof Node ? (node.ownerDocument || node).origin : node;
    if (obj.name) { // Otherwise the outer element would loss.
        obj = {elements: [obj]};
    }
    return xmlConverter.js2xml(obj, {
        spaceBeforeSelfClosingTag: true,    // Add the space before the slash of self-closing tag by default.
        ...opts,
    });
};

export default {parse, toXml};