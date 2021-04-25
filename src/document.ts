import Node from "./node";
import NodeGroup from "./node-group";
import Element from "./element";
import NodeGroupBackingData from "./backing-data/node-group-backing-data";

class Document extends NodeGroup {

    constructor(val?: NodeGroupBackingData) {
        super(val || {elements: []});
    }

    get nodeName() {
        return '#document';
    }

    get nodeType() {
        return Node.DOCUMENT_NODE;
    }

    get documentElement(): Element | null {
        return this.childNodes.find<Element>((child: Node): child is Element => child instanceof Element) || null;
    }

    get root() {
        return this.documentElement;
    }

    get ownerDocument(): Document | null {
        return this;
    }

    importNode(importedNode: Node, deep: boolean) {
        return importedNode.cloneNode(deep);
    }
}

export default Document;