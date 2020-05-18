import { UserServiceEventHistoryEntity } from './UserServiceEventHistoryEntity';

export class UserServiceDetails  {
    constructor(
        public serviceId: number,
        public ourserviceId: number,
        public userid: number,
        public childservicepkgserviceid: number,
        public createdby: string,
        public createdon: string,
        public isactive: boolean,
        public isservicepack: boolean,
        public isservicepurchased: boolean,
        public reasonofunsubscribe: string,
        public status: string,
        public servicestarton: string,
        public serviceendon: string,
        public amount: number,
        public validPeriodLabel: string,
        public validPeriodCode: string,
        public publishedlinkurl: string,
        public userServiceEventHistory: UserServiceEventHistoryEntity[] = [],
    ) {}
}
