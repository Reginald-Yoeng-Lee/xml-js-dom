import Node from "../node";
import NodeFactory from "./node-factory";
import BackingData from "../backing-data/backing-data";
import Element from "../element";
import ElementBackingData from "../backing-data/element-backing-data";

class ElementFactory implements NodeFactory {

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        const {elements, attributes, ...backingData} = data;
        if (!this.checkElementData(backingData)) {
            return null;
        }
        const element = new Element(backingData);
        for (const e of elements || []) {
            const child = mainFactory.parseNode(e, mainFactory, null);
            if (!child) {
                continue;
            }
            element.appendChild(child);
        }
        for (const [name, value] of Object.entries<string>(attributes || {})) {
            element.setAttribute(name, value);
        }
        return element;
    }

    protected checkElementData(data: BackingData): data is ElementBackingData {
        return data.type === 'element' && typeof data.name === 'string';
    }
}

export default ElementFactory;