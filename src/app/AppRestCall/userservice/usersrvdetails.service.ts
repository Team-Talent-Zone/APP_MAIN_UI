import { Reference } from './../../appmodels/Reference';
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

  saveUserServiceDetails(usersrvobj: UserServiceDetails, refCode: string) {
    usersrvobj.userServiceEventHistory = new Array<UserServiceEventHistoryEntity>();
    this.usersrvhistobj = new UserServiceEventHistoryEntity();
    this.usersrvhistobj.userId = usersrvobj.userid;
    this.usersrvhistobj.eventcode = refCode;
    this.usersrvhistobj.updatedby = usersrvobj.createdby;
    usersrvobj.userServiceEventHistory.push(this.usersrvhistobj);
    return this.http.post(`${environment.apiUrl}/saveUserServiceDetails/`, usersrvobj);
  }

  saveOrUpdateUserSVCDetails(usersrvobj: UserServiceDetails) {
    return this.http.post(`${environment.apiUrl}/saveOrUpdateUserSVCDetails/`, usersrvobj);
  }

  getAllUserServiceDetailsByUserId(userId: number) {
    return this.http.get(`${environment.apiUrl}/getAllUserServiceDetailsByUserId/` + userId + '/');
  }
}
