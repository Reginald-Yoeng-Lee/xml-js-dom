import Node from "./node";
import NodeGroup from "./node-group";
import Element from "./element";
import DocumentBackingData from "./backing-data/document-backing-data";
import Declaration from "./declaration";

class Document extends NodeGroup {

    private _declaration: Declaration | null = null;

    constructor(val?: DocumentBackingData) {
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

    set declaration(declaration: Declaration | null) {
        this._declaration && (this._declaration.ownerDocument = null);
        if (declaration) {
            this.origin.declaration = declaration.origin;
            declaration.ownerDocument = this;
        } else {
            delete this.origin.declaration;
        }
        this._declaration = declaration;
    }

    get declaration() {
        return this._declaration;
    }

    importNode(importedNode: Node, deep: boolean) {
        return importedNode.cloneNode(deep);
    }

    cloneNode(deep?: boolean): Document {
        const document = <Document>super.cloneNode(deep);
        document.declaration = <Declaration | null>this.declaration?.cloneNode(deep) ?? null;
        return document;
    }
}

export default Document;