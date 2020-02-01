import { Reference } from '../appmodels/Reference';
import { Adapter } from './adapter';

export class ReferenceAdapter implements Adapter<Reference> {
    adapt(item: any): Reference {
        return new Reference(
            item.refId,
            item.code,
            item.key,
            item.label,
            item.shortkey,
            item.referencelookupmapping
          );
    }
}
