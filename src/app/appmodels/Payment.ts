export class Payment {
    constructor(
        public paymentId: number,
        public amount: string,
        public key: string,
        public name: string,
        public createdon: string,
        public email: string,
        public firstname: string,
        public furl: string,
        public hash: string,
        public phone: string,
        public productinfo: string,
        // tslint:disable-next-line: variable-name
        public service_provider: string,
        public surl: string,
        public txnid: string,
        public serviceIds: string,
        public jobids: string
    ) {

    }
}
