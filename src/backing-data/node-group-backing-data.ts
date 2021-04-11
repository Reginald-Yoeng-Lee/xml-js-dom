import BackingData from "./backing-data";
import ElementBackingData from "./element-backing-data";

interface NodeGroupBackingData extends BackingData {

    elements?: ElementBackingData[];
}

export default NodeGroupBackingData;