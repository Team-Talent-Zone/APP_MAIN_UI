import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/appmodels/User';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/appconstants/config';
import { UserRole } from 'src/app/appmodels/UserRole';
import { UserBiz } from 'src/app/appmodels/UserBiz';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  saveUser(user: User , refCode: string) {
    console.log('shorrefCodetkey' , refCode);
    user.createdby = user.firstname;
    user.updateby = user.firstname;
    user.userroles = new UserRole();
    user.userroles.rolecode = refCode;
    user.userbizdetails = new UserBiz();
    return this.http.post(`${environment.apiUrl}/saveUser/`, user, config.httpHeaders);
  }

  checkusername(username: string) {
   return this.http.get(`${environment.apiUrl}/checkusername/` + username + '/' ,
    config.httpHeaders);
  }
}
