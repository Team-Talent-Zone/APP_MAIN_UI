import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserServiceDetails } from 'src/app/appmodels/UserServiceDetails';
import { User } from 'src/app/appmodels/User';

@Injectable({
  providedIn: 'root'
})
export class UsersrvdetailsService {

  constructor(
    private http: HttpClient,
    
  ) { }

  saveUserServiceDetails(usersrvobj: UserServiceDetails) {
    return this.http.post(`${environment.apiUrl}/saveUserServiceDetails/`, usersrvobj);
  }

}
