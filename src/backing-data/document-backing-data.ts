import NodeGroupBackingData from "./node-group-backing-data";
import DeclarationBackingData from "./declaration-backing-data";

interface DocumentBackingData extends NodeGroupBackingData {

    declaration?: DeclarationBackingData;
}

export default DocumentBackingData;