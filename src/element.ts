import Node from "./node";
import NodeGroup from "./node-group";
import NamedNodeMap from "./named-node-map";
import Attr from "./attr";
import Text from "./text";
import Namespace from "./namespace";
import CharacterData from "./character-data";
import ElementBackingData from "./backing-data/element-backing-data";

class Element extends NodeGroup {

    private readonly _attributes: NamedNodeMap<Attr>;

    constructor(val: ElementBackingData | string) {
        typeof val === 'string' && (val = {name: val});
        super({
            ...(val || {}),
            type: 'element',
        });
        this._attributes = new NamedNodeMap();
    }

    get nodeName() {
        return this.tagName;
    }

    get nodeType() {
        return Node.ELEMENT_NODE;
    }

    set tagName(name: string) {
        this.origin.name = name || '';
    }

    get tagName(): string {
        return this.origin.name || '';
    }

    get localName() {
        const separator = this.tagName.indexOf(':');
        return separator < 0 ? this.tagName : this.tagName.substring(separator + 1);
    }

    set prefix(prefix: string | null) {
        const previousPrefix = this.prefix || '';
        if (previousPrefix !== (prefix || '')) {
            const separator = this.tagName.indexOf(':');
            if (separator < 0) {
                this.tagName = `${prefix}:${this.tagName}`; // Here prefix certainly won't be null or empty.
            } else {
                this.tagName = prefix ? `${prefix}${this.tagName.substring(separator)}` : this.tagName.substring(separator + 1);
            }
        }
    }

    get prefix() {
        const separator = this.tagName.indexOf(':');
        return separator < 0 ? null : this.tagName.substring(0, separator);
    }

    get attributes() {
        return this._attributes;
    }

    setAttribute(name: string, value: string) {
        this.setAttributeNode(new Attr({name, value}));
    }

    getAttribute(name: string) {
        const attr = this.getAttributeNode(name);
        return attr && attr.value || '';
    }

    removeAttribute(name: string) {
        return this._cleanUpOldAttribute(this.attributes.removeNamedItem(name));
    }

    setAttributeNode(newAttr: Attr) {
        const oldAttr = this.attributes.getNamedItem(newAttr.name);
        this._cleanUpOldAttribute(oldAttr);

        newAttr.ownerElement = this;
        newAttr.valueChangedListener = attr => {
            if (this.getAttributeNode(attr.name) !== attr) {    // This attribute no longer belongs to this element.
                return;
            }
            if (!this.origin.attributes) {
                this.origin.attributes = {};
            }
            this.origin.attributes[attr.name] = attr.value;
        };
        this.attributes.setNamedItem(newAttr);
        newAttr.valueChangedListener(newAttr);
    }

    getAttributeNode(name: string) {
        return this.attributes.getNamedItem(name);
    }

    removeAttributeNode(oldAttr: Attr) {
        if (this !== oldAttr.ownerElement) {   // This attribute doesn't belong to this element.
            throw new Error('NOT_FOUND_ERR');
        }
        return this.removeAttribute(oldAttr.name);
    }

    private _cleanUpOldAttribute(oldAttr?: Attr | null) {
        if (!oldAttr) {
            return null;
        }
        delete this.origin.attributes[oldAttr.name];
        if (Object.keys(this.origin.attributes).length === 0) {
            delete this.origin.attributes;
        }
        oldAttr.ownerElement = null;
        delete oldAttr.valueChangedListener;
        return oldAttr;
    }

    /**
     * Sets the content of the element to be the text given. All existing text content and non-text context is removed.
     * If this element should have both textual content and nested elements, use setContent instead. Setting a null text
     * value is equivalent to setting an empty string value.
     *
     * @param text string|null new text content for the element
     */
    set text(text) {
        this.removeAllChildren();
        text && this.appendChild(new Text({text}));
    }

    /**
     * Returns the textual content directly held under this element as a string. This includes all text within this single
     * element, including whitespace and CDATA sections if they exist. It's essentially the concatenation of all Text and
     * CDATA nodes in this.childNodes. The call does not recurse into child elements. If no textual value exists for the
     * element, an empty string is returned.
     *
     * @return string text content for this element, or empty string if none
     */
    get text() {
        return this.childNodes.reduce((previousValue, currentValue) =>
                currentValue instanceof CharacterData ? `${previousValue}${currentValue.data}` : previousValue
            , '');
    }

    get textTrim() {
        return this.text.trim();
    }

    setNamespace(namespace?: Namespace | null) {
        const previousPrefix = this.prefix;
        if (!namespace || !namespace.url) { // Equals to clear current element's namespace.
            this.removeAttribute(this._constructNsAttrName(previousPrefix));
        } else {
            this.prefix = namespace.prefix;
            if ((previousPrefix || '') !== (namespace.prefix || '')) {
                this.removeAttribute(this._constructNsAttrName(previousPrefix));
            }
            if (this.getNamespaceUrl(namespace.prefix) !== namespace.url) {
                this.setAttribute(this._constructNsAttrName(namespace.prefix), namespace.url);
            }
        }
    }

    getNamespace(): Namespace | null {
        const url = this.getNamespaceUrl(this.prefix);
        if (this.prefix) {
            if (!url) {
                throw new Error(`Invalid namespace prefix ${this.prefix}. No url found.`);
            }
            return {prefix: this.prefix, url};
        }
        return url ? {prefix: '', url} : null;
    }

    getNamespaceUrl(prefix: string | null): string {
        return this.getAttribute(this._constructNsAttrName(prefix)) || (this.parentNode instanceof Element ? this.parentNode.getNamespaceUrl(prefix) : '');
    }

    protected _constructNsAttrName(prefix: string | null): string {
        return `xmlns${prefix && `:${prefix}` || ''}`;
    }

    cloneNode(deep?: boolean): Element {
        const attributes = this.origin.attributes;
        delete this.origin.attributes;    // Temporarily remove all attributes and leave the new cloned element handling itself.

        const newElement = super.cloneNode(deep) as Element;
        for (let attr of this.attributes) {
            newElement.setAttributeNode(attr.cloneNode());
        }

        attributes && (this.origin.attributes = attributes);
        return newElement;
    }
}

export default Element;