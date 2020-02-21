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
}
