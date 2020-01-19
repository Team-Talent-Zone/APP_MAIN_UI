import { ReferenceLookUpSubCategory } from './ReferenceLookUpSubCategory';

export class ReferenceLookUpMapping {
mapId: number;
code: string;
key: string;
label: string;
shortkey: string;
referencelookupmappingsubcategories: ReferenceLookUpSubCategory[];

constructor(response: ReferenceLookUpMapping) {
    this.mapId = response.mapId;
    this.code = response.code;
    this.key = response.key;
    this.label = response.label;
    this.shortkey = response.shortkey;
    this.referencelookupmappingsubcategories = response.referencelookupmappingsubcategories;
}
}
