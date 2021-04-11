import Node from "./node";
import CharacterData from "./character-data";
import CDATABackingData from "./backing-data/cdata-backing-data";

class CDATASection extends CharacterData {

    constructor(val: CDATABackingData | string) {
        typeof val === 'string' && (val = {cdata: val});
        super({
            ...(val || {}),
            type: 'cdata',
        });
    }

    get nodeName() {
        return '#cdata-section';
    }

    get nodeType() {
        return Node.CDATA_SECTION_NODE;
    }

    set data(data) {
        this.origin.cdata = data;
    }

    get data() {
        return this.origin.cdata;
    }
}

export default CDATASection;