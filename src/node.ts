import NodeList from "./node-list";
import type NamedNodeMap from "./named-node-map";
import BackingData from "./backing-data/backing-data";
import type Attr from "./attr";
import type Document from "./document";

abstract class Node {

    static readonly ELEMENT_NODE = 1;
    static readonly ATTRIBUTE_NODE = 2;
    static readonly TEXT_NODE = 3;
    static readonly CDATA_SECTION_NODE = 4;
    static readonly DOCUMENT_NODE = 9;

    private readonly _origin: BackingData;
    private readonly _childNodes: NodeList<Node>;
    private _parentNode: Node | null;

    constructor(val: BackingData | null = null) {
        this._origin = val || {};

        this._childNodes = new NodeList();
        this._parentNode = null;
    }

    abstract get nodeName(): string;

    set nodeValue(val: string | null) {
    }

    get nodeValue(): string | null {
        return null;
    }

    abstract get nodeType(): number;

    set parentNode(parent) {
        this._parentNode = parent;
    }

    get parentNode() {
        return this._parentNode;
    }

    get childNodes() {
        return this._childNodes;
    }

    get firstChild(): Node | null {
        return this.childNodes[0] || null;
    }

    get lastChild(): Node | null {
        return this.childNodes.length > 0 && this.childNodes[this.childNodes.length - 1] || null;
    }

    get previousSibling() {
        return this.parentNode && this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] || null;
    }

    get nextSibling() {
        return this.parentNode && this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] || null;
    }

    get localName(): string | null {
        return null;
    }

    set prefix(prefix: string | null) {
    }

    get prefix(): string | null {
        return null;
    }

    get attributes(): NamedNodeMap<Attr> | null {
        return null;
    }

    get ownerDocument(): Document | null {
        return this.parentNode?.ownerDocument || null;
    }

    get origin() {
        return this._origin;
    }

    insertBefore(newChild: Node, refChild?: Node | null) {
        const refIndex = this._verifyChildModification(newChild, refChild);
        if (refIndex > 0 && this.childNodes.indexOf(newChild) === refIndex - 1) {   // The newChild is just at its right place.
            return newChild;
        }

        this.childNodes.splice(refIndex, 0, newChild.detach());
        newChild.parentNode = this;
        return newChild;
    }

    replaceChild(newChild: Node, oldChild: Node) {
        if (!oldChild) {
            throw new Error('NULL_POINTER_ERR');
        }
        const oldIndex = this._verifyChildModification(newChild, oldChild);
        newChild.detach();
        newChild.parentNode = this;
        return this.childNodes.splice(oldIndex, 1, newChild)[0];
    }

    removeChild(oldChild: Node) {
        const index = this.childNodes.indexOf(oldChild);
        if (index < 0) {
            throw new Error('NOT_FOUND_ERR');
        }
        oldChild.parentNode = null;
        return this.childNodes.splice(index, 1)[0];
    }

    removeAllChildren() {
        for (let child: Node | null | undefined = this.lastChild, previousSibling = child?.previousSibling; child; previousSibling = previousSibling?.previousSibling) {
            this.removeChild(child);
            child = previousSibling;
        }
    }

    appendChild(newChild: Node) {
        this._verifyChildModification(newChild);
        this.childNodes.push(newChild.detach());
        newChild.parentNode = this;
        return newChild;
    }

    private _verifyChildModification(newChild: Node, refChild?: Node | null) {
        const refIndex = refChild ? this.childNodes.indexOf(refChild) : this.childNodes.length;
        if (refIndex < 0) {
            throw new Error('NOT_FOUND_ERR');
        }
        if (newChild.ownerDocument && newChild.ownerDocument !== this.ownerDocument) {
            throw new Error('WRONG_DOCUMENT_ERR');
        }
        if (this._isAncestorNode(newChild)) {
            throw new Error('HIERARCHY_REQUEST_ERR');
        }
        return refIndex;
    }

    private _isAncestorNode(node: Node): boolean {
        if (this.parentNode) {
            return this.parentNode === node || this.parentNode._isAncestorNode(node);
        }
        return false;
    }

    hasAttributes() {
        return !!this.attributes && this.attributes.length > 0;
    }

    hasChildNodes() {
        return this.childNodes.length > 0;
    }

    getTextValue(): string {
        return this.childNodes.reduce(((previousValue, currentValue) => previousValue + currentValue.getTextValue()), '');
    }

    detach(): Node {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        return this;
    }

    cloneNode(deep?: boolean): Node {
        const newNode = new (this.constructor as ObjectConstructor)(this._cloneObject(this._origin)) as Node;
        if (deep) {
            for (let child of this.childNodes) {
                newNode.appendChild(child.cloneNode(deep));
            }
        }
        return newNode;
    }

    protected _cloneObject(obj: BackingData | BackingData[]): BackingData | BackingData[] {
        const target: any = Array.isArray(obj) ? [] : {};
        for (let [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object') {
                target[key] = this._cloneObject(value);
            } else if (typeof value !== 'function') {
                target[key] = value;
            }
        }
        return target;
    }
}

export default Node;