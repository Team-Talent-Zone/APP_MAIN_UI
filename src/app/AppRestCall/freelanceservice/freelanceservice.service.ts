import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FreelanceOnSvc } from 'src/app/appmodels/FreelanceOnSvc';

@Injectable({
  providedIn: 'root'
})
export class FreelanceserviceService {

  constructor(
    private http: HttpClient,
  ) { }

  saveFreelancerOnService(freelanceOnService: FreelanceOnSvc) {
    return this.http.post(`${environment.apiUrl}/saveFreeLanceOnService/`, freelanceOnService);
  }

  saveOrUpdateFreelancerOnService(freelanceOnService: FreelanceOnSvc) {
    return this.http.post(`${environment.apiUrl}/saveOrUpdateFreeLanceOnService/`, freelanceOnService);
  }

  getUserAllJobDetailsByUserId(userId: number) {
    return this.http.get(`${environment.apiUrl}/getUserAllJobDetailsByUserId/` + userId + '/');
  }

  getAllFreelanceOnServiceDetailsByJobId(jobId: number) {
    return this.http.get(`${environment.apiUrl}/getAllFreelanceOnServiceDetailsByJobId/` + jobId + '/');
  }

  deleteFreelanceSVCDetails(freelanceOnService: FreelanceOnSvc) {
    return this.http.post(`${environment.apiUrl}/deleteFreelanceSVCDetails/`, freelanceOnService);

  }
}
