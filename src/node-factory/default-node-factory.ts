import NodeFactoryGroup from "./node-factory-group";
import NodeFactory from "./node-factory";
import Node from "../node";
import BackingData from "../backing-data/backing-data";
import DocumentFactory from "./document-factory";
import ElementFactory from "./element-factory";
import TextFactory from "./text-factory";
import CDATASectionFactory from "./cdata-section-factory";

class DefaultNodeFactory implements NodeFactoryGroup {

    factories: NodeFactory[] = [];

    constructor() {
        this.initFactories();
    }

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        return this.factories.reduce(((node: Node | null, factory: NodeFactory) => factory.parseNode(data, mainFactory, node) || node), null);
    }

    protected initFactories() {
        this.factories.push(
            new DocumentFactory(),
            new ElementFactory(),
            new TextFactory(),
            new CDATASectionFactory(),
        );
    }
}

export default DefaultNodeFactory;