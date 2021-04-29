import Node from "./node";
import AttrBackingData from "./backing-data/attr-backing-data";
import type Element from "./element";

class Attr extends Node {

    private _ownerElement: Element | null;
    private _valueChangedListener?: (attr: Attr) => void;

    constructor(val: AttrBackingData);
    constructor(name: string, value: string);
    constructor(name: AttrBackingData | string, value?: string) {
        super(typeof name === 'object' ? name : {name, value: value!})
        this._ownerElement = null;
    }

    get origin(): AttrBackingData {
        return super.origin as AttrBackingData;
    }

    get name(): string {
        return this.origin.name;
    }

    get nodeName() {
        return this.name;
    }

    get nodeType() {
        return Node.ATTRIBUTE_NODE;
    }

    get ownerDocument() {
        return this.ownerElement && this.ownerElement.ownerDocument || null;
    }

    set ownerElement(owner: Element | null) {
        this._ownerElement = owner;
    }

    get ownerElement(): Element | null {
        return this._ownerElement;
    }

    set value(val) {
        if (this.origin.value === val) {
            return; // prevent calling this.valueChangedListener if nothing changed.
        }
        this.origin.value = val;
        this.valueChangedListener && this.valueChangedListener(this);
    }

    get value() {
        return this.origin.value;
    }

    get localName() {
        return this.name;
    }

    set valueChangedListener(listener) {
        this._valueChangedListener = listener;
    }

    get valueChangedListener() {
        return this._valueChangedListener;
    }

    detach(): Attr {
        this.ownerElement && this.ownerElement.removeAttributeNode(this);
        this.ownerElement = null;
        delete this.valueChangedListener;
        return this;
    }

    cloneNode(deep?: boolean): Attr {
        return super.cloneNode(true) as Attr;
    }
}

export default Attr;