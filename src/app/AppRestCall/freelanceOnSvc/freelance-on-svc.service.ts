import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FreelanceOnSvc } from 'src/app/appmodels/FreelanceOnSvc';

@Injectable({
  providedIn: 'root'
})
export class FreelanceOnSvcService {
  constructor(private http: HttpClient) { }

  getUserAllJobDetails(scategory : string)
  {
    return this.http.get(`${environment.apiUrl}/getUserAllJobDetailsBySubCategory/`+ scategory + '/');
  }

  saveOrUpdateFreeLanceOnService(freelanceonsvcobj: FreelanceOnSvc)
  {
    console.log("will go to restapi")
    return this.http.post(`${environment.apiUrl}/saveOrUpdateFreeLanceOnService/`,freelanceonsvcobj);
  }

  getAllFreelanceOnServiceDetailsByJobId(jobID: number)
  {
    return this.http.get(`${environment.apiUrl}/getAllFreelanceOnServiceDetailsByJobId/`+ jobID + '/');
  }

}
