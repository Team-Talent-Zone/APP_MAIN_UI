import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';
import { Adapter } from './adapter';

export class ReferenceLookUpTemplateAdapter implements Adapter<ReferenceLookUpTemplate> {
    adapt(item: any): ReferenceLookUpTemplate {
        return new ReferenceLookUpTemplate(
            item.name,
            item.url,
            item.description,
            item.shortkey
          );
    }
}
