import Node from "../node";
import NodeFactory from "./node-factory";
import BackingData from "../backing-data/backing-data";
import CDATABackingData from "../backing-data/cdata-backing-data";
import CDATASection from "../cdata-section";

class CDATASectionFactory implements NodeFactory {

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        return this.checkCDATA(data) ? new CDATASection(data.cdata || '') : null;
    }

    protected checkCDATA(data: BackingData): data is CDATABackingData {
        return data.type === 'cdata';
    }
}

export default CDATASectionFactory;