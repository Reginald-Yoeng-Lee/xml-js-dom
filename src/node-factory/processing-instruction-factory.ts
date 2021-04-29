import NodeFactory from "./node-factory";
import Node from "../node";
import BackingData from "../backing-data/backing-data";
import ProcessingInstructionBackingData from "../backing-data/processing-instruction-backing-data";
import ProcessingInstruction from "../processing-instruction";

class ProcessingInstructionFactory implements NodeFactory {

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): ProcessingInstruction | null {
        return this.checkProcessingInstructionData(data) ? new ProcessingInstruction(data) : null;
    }

    protected checkProcessingInstructionData(data: BackingData): data is ProcessingInstructionBackingData {
        return data.type === 'instruction';
    }
}

export default ProcessingInstructionFactory;