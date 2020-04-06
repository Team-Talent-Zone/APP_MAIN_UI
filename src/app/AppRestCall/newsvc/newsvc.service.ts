import { NewServiceHistory } from './../../appmodels/NewServiceHistory';
import { NewService } from './../../appmodels/NewService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsvcService {


  constructor(private http: HttpClient) { }

  getAllNewServiceDetails() {
    return this.http.get(`${environment.apiUrl}/getAllNewServiceDetails/`);
  }

  saveNewService(newservice: NewService) {
      return this.http.post(`${environment.apiUrl}/saveNewService/`, newservice);
  }

  saveOrUpdateNewService(newservice: NewService) {
    return this.http.post(`${environment.apiUrl}/saveOrUpdateNewService/`, newservice);
  }

  saveNewServiceHistory(newservicehistory: NewServiceHistory) {
    return this.http.post(`${environment.apiUrl}/saveNewServiceHistory/`, newservicehistory);
  }

  getNewServiceDetailsByServiceId(ourserviceId: number) {
    return this.http.get(`${environment.apiUrl}/getNewServiceDetailsByServiceId/` + ourserviceId + '/');
  }

  checkNewServiceIsExist(servicename: string) {
    return this.http.get(`${environment.apiUrl}/checkNewServiceIsExist/` + servicename + '/');
  }
}
