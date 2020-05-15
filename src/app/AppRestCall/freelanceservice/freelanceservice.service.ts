import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FreelanceserviceService {

  constructor(
    private http: HttpClient,
  ) { }

  saveFreelancerOnService(freelanceonserviceobj: FreelanceserviceService) {
    return this.http.post(`${environment.apiUrl}/saveFreeLanceOnService/`, freelanceonserviceobj);
  }

  saveOrUpdateFreelancerOnService() {

  }
}
