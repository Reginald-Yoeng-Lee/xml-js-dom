import BackingData from "../backing-data/backing-data";
import Node from "../node";

interface NodeFactory {
    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null;
}

export default NodeFactory;