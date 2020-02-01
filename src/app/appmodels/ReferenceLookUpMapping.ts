import { ReferenceLookUpSubCategory } from './ReferenceLookUpSubCategory';

export class ReferenceLookUpMapping {

constructor(
    public mapId: number ,
    public code: string,
    public key: string,
    public label: string,
    public shortkey: string,
    public referencelookupmappingsubcategories: ReferenceLookUpSubCategory[]) {
}
}
