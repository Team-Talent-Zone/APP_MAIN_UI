export class FreelanceOnSvc {
    constructor(
        public jobId: number,
        public serviceId: number,
        public freelanceuserId: number,
        public userId: number,
        public jobstartedon: number,
        public jobendedon: string,
        public status: string,
        public isjobaccepted: boolean,
        public updatedon: string,
        public updatedby: string,
        public isjobactive: boolean,
        public totalhoursofjob: number,
        public amount: number,
        public tocompanyamount: number,
        public tofreelanceamount: number,
        public isjobamtpaidtofu: boolean,
        public isjobcompleted: boolean,
        public isjobamtpaidtocompany: boolean,
        public isjobcancel: boolean,
        public subcategory: string,
        public joblocation: string,
        public route: string,
        public city: string,
        public state: string,
        public country: string,
        public lat: number,
        public lng: number,
        public jobdescription: string
    ) {

    }
}