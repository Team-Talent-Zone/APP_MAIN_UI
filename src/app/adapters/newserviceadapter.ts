import { Adapter } from './adapter';
import { User } from '../appmodels/User';
import { NewService } from '../appmodels/NewService';

export class NewServiceAdapter implements Adapter<NewService> {
    adapt(item: any): NewService {
        return new NewService(
            item.ourserviceId,
            item.name,
            item.domain,
            item.category,
            item.isActive,
            item.description,
            item.fullContent,
            item.imageUrl,
            item.createdBy,
            item.createdOn,
            item.updatedOn,
            item.updatedBy,
            item.isUpgrade,
            item.validPeriod,
            item.amount,
            item.userId,
            item.serviceHistory
          );
    }
}
