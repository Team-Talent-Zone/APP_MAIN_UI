import { Adapter } from './adapter';
import { FreelanceOnSvc } from '../appmodels/FreelanceOnSvc';


export class FreelanceOnSvcAdapter implements Adapter<FreelanceOnSvc> {
    adapt(item: any): FreelanceOnSvc {
        return new FreelanceOnSvc(
            item.jobId,
            item.serviceId,
            item.freelanceuserId,
            item.userId,
            item.jobstartedon,
            item.jobendedon,
            item.status,
            item.isjobaccepted,
            item.updatedon,
            item.updatedby,
            item.isjobactive,
            item.totalhoursofjob,
            item.amount,
            item.tocompanyamount,
            item.tofreelanceamount,
            item.isjobpaidtofu,
            item.isjobcompleted,
            item.isjobamtpaidtocompany,
            item.isjobcancel,
            item.subcategory,
            item.joblocation,
            item.route,
            item.city,
            item.state,
            item.country,
            item.lat,
            item.lng,
            item.jobdescription,
            item.txnid,
            );      
    }
}