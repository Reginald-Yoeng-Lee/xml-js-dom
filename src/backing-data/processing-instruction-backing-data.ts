import BackingData from "./backing-data";

interface ProcessingInstructionBackingData extends BackingData {

    name: string;

    instruction: string;
}

export default ProcessingInstructionBackingData;