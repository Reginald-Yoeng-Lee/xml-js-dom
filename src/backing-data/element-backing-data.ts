import NodeGroupBackingData from "./node-group-backing-data";
import {Attributes} from "@reginaldlee/xml-js";

interface ElementBackingData extends NodeGroupBackingData {

    name: string;

    attributes?: Attributes;
}

export default ElementBackingData;