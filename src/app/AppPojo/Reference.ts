import { ReferenceLookUpMapping } from './ReferenceLookUpMapping';

export class Reference  {
refId: number;
code: string;
key: string;
label: string;
shortkey: string;
referencelookupmapping: ReferenceLookUpMapping[];

constructor(response: any) {
    this.refId = response.refId;
    this.code = response.code;
    this.key = response.key;
    this.label = response.label;
    this.shortkey = response.shortkey;
    this.referencelookupmapping = response.referencelookupmapping;
}
}
