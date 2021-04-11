import Node from "./node";
import NodeGroup from "./node-group";
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

    get documentElement(): Node | null {
        return this.childNodes[0] || null;
    }

    get root() {
        return this.documentElement;
    }

    importNode(importedNode: Node, deep: boolean) {
        return importedNode.cloneNode(deep);
    }
}

export default Document;