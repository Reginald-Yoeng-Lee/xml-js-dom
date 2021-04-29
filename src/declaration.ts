import DeclarationBackingData from "./backing-data/declaration-backing-data";
import type Document from "./document";
import Node from "./node";

class Declaration extends Node {

    private readonly _declarationAttributes: DeclarationBackingData;

    private _document: Document | null;

    constructor(val: DeclarationBackingData = {}) {
        super(val);
        this._declarationAttributes = val;    // For compatible with cloneNode()
        this._document = null;
    }

    get nodeName() {
        return '#declaration';
    }

    get nodeType(): number {
        return 0;   // Declaration doesn't have an actual type.
    }

    set ownerDocument(document: Document | null) {
        this._document = document;
    }

    get ownerDocument(): Document | null {
        return this._document;
    }

    set version(version: string | number) {
        if (!version) {
            this._removeDeclarationAttribute('version');
            return;
        }
        if (!this._declarationAttributes.attributes) {
            this._declarationAttributes.attributes = {};
        }
        this._declarationAttributes.attributes.version = version;
    }

    get version() {
        return this._declarationAttributes.attributes?.version ?? '';
    }

    set encoding(encoding: string) {
        if (!encoding) {
            this._removeDeclarationAttribute('encoding');
            return;
        }
        if (!this._declarationAttributes.attributes) {
            this._declarationAttributes.attributes = {};
        }
        this._declarationAttributes.attributes.encoding = encoding;
    }

    get encoding() {
        return this._declarationAttributes.attributes?.encoding ?? 'utf-8';
    }

    set standalone(standalone: 'yes' | 'no' | '') {
        if (!standalone) {
            this._removeDeclarationAttribute('standalone');
            return;
        }
        if (!this._declarationAttributes.attributes) {
            this._declarationAttributes.attributes = {};
        }
        this._declarationAttributes.attributes.standalone = standalone;
    }

    get standalone() {
        return this._declarationAttributes.attributes?.standalone ?? 'no';
    }

    detach(): Declaration {
        this.ownerDocument && (this.ownerDocument.declaration = null);
        return this;
    }

    private _removeDeclarationAttribute(name: 'version' | 'encoding' | 'standalone') {
        delete this._declarationAttributes.attributes?.[name];
        if (this._declarationAttributes.attributes && Object.keys(this._declarationAttributes.attributes).length === 0) {
            delete this._declarationAttributes.attributes;
        }
    }
}

export default Declaration;