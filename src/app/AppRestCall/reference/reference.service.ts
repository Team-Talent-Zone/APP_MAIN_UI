import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/appconstants/config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

constructor(private http: HttpClient) { }

getReferenceLookupByShortKey(shortkey: string) {
 return this.http.get(`${environment.apiUrl}/getReferenceLookupByShortKey/` + shortkey,
  config.httpHeaders);
}
getReferenceLookupByKey(key: string) {
  return this.http.get(`${environment.apiUrl}/getReferenceLookupByKey/` + key,
  config.httpHeaders);
}
}
