import Node from "./node";

class NodeList<N extends Node> extends Array<N> {

    item(index: number): N | null {
        return index >= 0 && this[index] || null;
    }
}

export default NodeList;