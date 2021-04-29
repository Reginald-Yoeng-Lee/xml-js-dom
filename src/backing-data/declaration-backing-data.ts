import BackingData from "./backing-data";
import {DeclarationAttributes} from "@reginaldlee/xml-js";

interface DeclarationBackingData extends BackingData {

    attributes?: DeclarationAttributes;
}

export default DeclarationBackingData;