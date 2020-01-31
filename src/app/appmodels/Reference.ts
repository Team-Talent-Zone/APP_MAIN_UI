import { ReferenceLookUpMapping } from './ReferenceLookUpMapping';

export class Reference  {

constructor(
    public refId: number,
    public code: string,
    public key: string,
    public label: string,
    public shortkey: string,
    public referencelookupmapping: ReferenceLookUpMapping[],
  ) { }

}


