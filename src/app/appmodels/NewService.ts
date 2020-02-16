import { NewServiceHistory } from './NewServiceHistory';
export class NewService  {
    constructor(
        public ourserviceId: number,
        public name: string,
        public domain: string,
        public category: string,
        public isActive: boolean,
        public description: string,
        public fullContent: string,
        public imageUrl: string,
        public createdBy: string,
        public createdOn: string,
        public updatedOn: string,
        public updatedBy: string,
        public isUpgrade: boolean,
        public validPeriod: string,
        public amount: number,
        public userId: number,
        public serviceHistory: NewServiceHistory
        ) {
        }
}
