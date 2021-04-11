import Node from "./node";
import NodeGroupBackingData from "./backing-data/node-group-backing-data";

abstract class NodeGroup extends Node {

    constructor(val: NodeGroupBackingData) {
        super({
            elements: [],
            ...(val || {}),
        });
    }

    insertBefore(newChild: Node, refChild?: Node) {
        super.insertBefore(newChild, refChild);
        const index = this.childNodes.indexOf(newChild);
        if (this.origin.elements[index] !== newChild.origin) {
            this.origin.elements.splice(index, 0, newChild.origin);
        }
        return newChild;
    }

    replaceChild(newChild: Node, oldChild: Node) {
        super.replaceChild(newChild, oldChild);
        const index = this.childNodes.indexOf(newChild);
        this.origin.elements.splice(index, 1, newChild.origin);
        return oldChild;
    }

    removeChild(oldChild: Node) {
        const index = this.childNodes.indexOf(oldChild);
        super.removeChild(oldChild);
        this.origin.elements.splice(index, 1);
        return oldChild;
    }

    appendChild(newChild: Node) {
        super.appendChild(newChild);
        this.origin.elements.push(newChild.origin);
        return newChild;
    }

    cloneNode(deep?: boolean): NodeGroup {
        const elements = this.origin.elements.splice(0);    // Temporarily remove all children, to let the cloneNode() decide whether cloning the children.
        try {
            return super.cloneNode(deep);
        } finally {
            this.origin.elements.push(...elements);
        }
    }
}

export default NodeGroup;