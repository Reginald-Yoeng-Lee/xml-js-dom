import ProcessingInstructionBackingData from "./backing-data/processing-instruction-backing-data";
import Node from "./node";

class ProcessingInstruction extends Node {

    constructor(val: ProcessingInstructionBackingData) {
        super({
            ...val,
            type: 'instruction',
        });
    }

    get nodeName(): string {
        return this.target;
    }

    get nodeType(): number {
        return Node.PROCESSING_INSTRUCTION_NODE;
    }

    set target(target: string) {
        this.origin.name = target;
    }

    get target(): string {
        return this.origin.name;
    }

    set data(data: string) {
        this.instruction = data;
    }

    get data() {
        return this.instruction;
    }

    set instruction(instruction: string) {
        this.origin.instruction = instruction;
    }

    get instruction(): string {
        return this.origin.instruction;
    }
}

export default ProcessingInstruction;