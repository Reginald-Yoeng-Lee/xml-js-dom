import Node from "../node";
import NodeFactory from "./node-factory";
import BackingData from "../backing-data/backing-data";
import TextBackingData from "../backing-data/text-backing-data";
import Text from "../text";

class TextFactory implements NodeFactory {

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        return this.checkTextData(data) ? new Text(data.text || '') : null;
    }

    protected checkTextData(data: BackingData): data is TextBackingData {
        return data.type === 'text';
    }
}

export default TextFactory;