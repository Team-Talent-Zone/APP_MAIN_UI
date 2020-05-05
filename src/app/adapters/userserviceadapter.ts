import { Adapter } from './adapter';
import { UserServiceDetails } from '../appmodels/UserServiceDetails';

export class UserServicedetailsAdapter implements Adapter<UserServiceDetails> {
    adapt(item: any): UserServiceDetails {
        return new UserServiceDetails(
            item.serviceId,
            item.ourserviceId,
            item.userid,
            item.childservicepkgserviceid,
            item.createdon,
            item.createdby,
            item.isactive,
            item.isservicepack,
            item.isservicepurchased,
            item.reasonofunsubscribe,
            item.status,
            item.servicestarton,
            item.serviceendon,
            item.amount,
            item.validPeriodLabel,
            item.validPeriodCode,
            item.userServiceEventHistory,
          );
    }
}
