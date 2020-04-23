import { UserServiceEventHistoryEntity } from './UserServiceEventHistoryEntity';

export class UserServiceDetails  {
    constructor(
        public serviceId: number,
        public ourserviceId: number,
        public userId: number,        
        public createdby: string,
        public createdon: string,
        public isactive : boolean,
        public reasonofunsubscribe: string,
        public servicepackname: string,
        public status: string,
        public servicestarton: string,
        public serviceendon: string,
        public userServiceEventHistory: UserServiceEventHistoryEntity[] = [],
    ){}
}