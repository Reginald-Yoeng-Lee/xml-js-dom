import NodeFactory from "./node-factory";

interface NodeFactoryGroup extends NodeFactory {

    factories: NodeFactory[];
}

export default NodeFactoryGroup;