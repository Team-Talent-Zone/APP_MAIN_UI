import { Adapter } from './adapter';
import { UserServiceDetails } from '../appmodels/UserServiceDetails';

export class UserServicedetailsAdapter implements Adapter<UserServiceDetails> {
    adapt(item: any): UserServiceDetails {
        return new UserServiceDetails(
            item.serviceId,
            item.ourserviceId,
            item.userid,
            item.createdon,
            item.createdby,
            item.isactive,
            item.reasonofunsubscribe,
            item.servicepackname,
            item.status,
            item.servicestarton,
            item.serviceendon,
            item.userServiceEventHistory,
          );
    }
}
