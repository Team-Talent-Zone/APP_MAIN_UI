import { Injectable } from '@angular/core';
import { User } from 'src/app/appmodels/User';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/appconstants/config';
import { UserRole } from 'src/app/appmodels/UserRole';
import { UserBiz } from 'src/app/appmodels/UserBiz';
import { Freelance } from 'src/app/appmodels/Freelance';
import { FreelanceHistory } from 'src/app/appmodels/FreelanceHistory';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAdapter } from 'src/app/adapters/useradapter';
import { UserNotification } from 'src/app/appmodels/UserNotification';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  usrObj: User;
  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  loginUserByUsername(username: string , password: string) {
    return this.http.get(`${environment.apiUrl}/findByUsername/` + username + '/' + password  + '/') .pipe(map(user => {
      this.usrObj = this.userAdapter.adapt(user);
     // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(this.usrObj));
      this.currentUserSubject.next(this.usrObj);
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
}

  saveUser(user: User , refCode: string , shortkey: string) {
    user.createdby = user.firstname;
    user.avtarurl = config.default_avatar;
    user.updateby = user.firstname;
    user.userroles = new UserRole();
    user.userroles.rolecode = refCode;
    user.userbizdetails = new UserBiz();
    if (shortkey === config.shortkey_role_fu) {
      user.freeLanceDetails = new Freelance();
      user.freelancehistoryentity = new FreelanceHistory();
    }
    return this.http.post(`${environment.apiUrl}/saveUser/`, user);
  }

  checkusernamenotexist(username: string) {
   return this.http.get(`${environment.apiUrl}/checkusernamenotexist/` + username + '/');
  }

  checkusername(username: string) {
    return this.http.get(`${environment.apiUrl}/checkusername/` + username + '/');
   }

   saveorupdate(user: User) {
    return this.http.post(`${environment.apiUrl}/saveorupdateuser/`, user);
   }

   getUserByUserId(userId: number) {
    return this.http.get(`${environment.apiUrl}/getUserByUserId/` + userId + '/');
   }

   forgetPassword(username: string) {
    return this.http.get(`${environment.apiUrl}/forgetPassword/` + username + '/');
   }

   saveUserNotification(usernotification: UserNotification) {
    return this.http.post(`${environment.apiUrl}/saveUserNotification/`, usernotification);
   }

   getAllUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/getAllUsers/`);
   }
}
