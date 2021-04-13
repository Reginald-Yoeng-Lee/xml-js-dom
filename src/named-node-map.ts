import type Node from "./node";

class NamedNodeMap<N extends Node> {

    private _nodeMap = new Map<string, N>();

    setNamedItem(node: N) {
        this._nodeMap.set(node.nodeName, node);
    }

    getNamedItem(name: string) {
        return this._nodeMap.get(name);
    }

    removeNamedItem(name: string) {
        const node = this._nodeMap.get(name);
        this._nodeMap.delete(name);
        return node || null;
    }

    item(index: number) {
        if (index < 0 || index >= this.length) {
            return null;
        }
        const [, node] = [...this._nodeMap][index];
        return node || null;
    }

    get length() {
        return this._nodeMap.size;
    }

    [Symbol.iterator](): IterableIterator<N> {
        return this._nodeMap.values();
    }
}

export default NamedNodeMap;