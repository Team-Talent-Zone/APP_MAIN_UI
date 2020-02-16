export class NewServiceHistory  {

    constructor(
     public ourserviceId: number,
     public userId: number,
     public decisionBy: string,
     public decisionOn: string,
     public status: string,
     public comment: string,
     public isLocked: boolean,
     public managerId: number
    ) {

}
}
