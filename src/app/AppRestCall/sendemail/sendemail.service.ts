import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { config } from 'src/app/appconstants/config';
import { Util } from 'src/app/appmodels/Util';

@Injectable({
  providedIn: 'root'
})
export class SendemailService {

  constructor(
    private http: HttpClient,
  ) { }

  sendEmail(util: Util) {
    return this.http.post(`${environment.apiUrl}/sendemail/`, util);
  }
}
