import Node from "./node";
import CharacterData from "./character-data";
import TextBackingData from "./backing-data/text-backing-data";

class Text extends CharacterData {

    constructor(val: TextBackingData | string) {
        typeof val === 'string' && (val = {text: val});
        super({
            ...(val || {}),
            type: 'text',
        });
    }

    get nodeName() {
        return super.nodeName;
    }

    get nodeType() {
        return Node.TEXT_NODE;
    }

    set data(data) {
        this.origin.text = data;
    }

    get data() {
        return this.origin.text;
    }

    splitText(offset: number) {
        if (offset < 0 || offset > this.length) {
            throw new Error('INDEX_SIZE_ERR');
        }
        const newText = new Text({text: this.data.substring(offset)});
        this.data = this.data.substring(0, offset);

        this.parentNode && this.parentNode.insertBefore(newText, this.nextSibling);
        return newText;
    }
}

export default Text;