import { UserBiz } from './UserBiz';
import { UserRole } from './UserRole';
export class User  {
     constructor(
        public userId: number,
        public username: string,
        public password: string,
        public isactive: boolean,
        public firstname: string,
        public lastname: string,
        public isrecoverypwd: string,
        public reasonofdeactivation: string,
        public createdon: string,
        public createdby: string,
        public updateby: string,
        public updatedon: string,
        public avtarurl: string,
        public userroles: UserRole,
        public userbizdetails: UserBiz
    ) {

    }
}
