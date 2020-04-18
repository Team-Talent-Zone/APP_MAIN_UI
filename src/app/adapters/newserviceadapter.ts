import { Adapter } from './adapter';
import { NewService } from '../appmodels/NewService';

export class NewServiceAdapter implements Adapter<NewService> {
    adapt(item: any): NewService {
        return new NewService(
            item.ourserviceId,
            item.name,
            item.domain,
            item.category,
            item.active,
            item.currentstatus,
            item.description,
            item.fullContent,
            item.imageUrl,
            item.createdBy,
            item.createdOn,
            item.updatedOn,
            item.updatedBy,
            item.isupgrade,
            item.validPeriod,
            item.amount,
            item.packwithotherourserviceid,
            item.userId,
            item.serviceHistory
          );
    }
}
