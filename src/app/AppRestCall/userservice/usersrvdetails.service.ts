import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserServiceDetails } from 'src/app/appmodels/UserServiceDetails';
import { UserServiceEventHistoryEntity } from 'src/app/appmodels/UserServiceEventHistoryEntity';
import { User } from 'src/app/appmodels/User';

@Injectable({
  providedIn: 'root'
})
export class UsersrvdetailsService {

  usersrvhistobj: UserServiceEventHistoryEntity;

  constructor(
    private http: HttpClient,
  ) { }

  saveUserServiceDetails(usersrvobj: UserServiceDetails, usrObj: User, ourserviceId: number) {
    usersrvobj.ourserviceId = ourserviceId;
    usersrvobj.userid = usrObj.userId;
    usersrvobj.createdon = usrObj.fullname;
    usersrvobj.userServiceEventHistory = new Array<UserServiceEventHistoryEntity>();
    this.usersrvhistobj = new UserServiceEventHistoryEntity();
    this.usersrvhistobj.userId = usrObj.userId;
    usersrvobj.userServiceEventHistory.push(this.usersrvhistobj);
    return this.http.post(`${environment.apiUrl}/saveUserServiceDetails/`, usersrvobj);
  }

}
