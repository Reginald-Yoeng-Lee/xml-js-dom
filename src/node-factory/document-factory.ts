import Node from "../node";
import NodeFactory from "./node-factory";
import BackingData from "../backing-data/backing-data";
import Document from "../document";

class DocumentFactory implements NodeFactory {
    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        if (data.type === undefined && (!data.elements || Array.isArray(data.elements))) {
            const document = new Document();
            for (let e of data.elements || []) {
                const child = mainFactory.parseNode(e, mainFactory, null);
                if (!child) {
                    continue;
                }
                document.appendChild(child);
            }
            return document;
        }
        return null;
    }
}

export default DocumentFactory;