import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  constructor(private http: HttpClient) { }

  getReferenceLookupByShortKey(shortkey: string) {
    return this.http.get(`${environment.apiUrl}/getReferenceLookupByShortKey/` + shortkey);
  }
  getReferenceLookupByKey(key: string) {
    return this.http.get(`${environment.apiUrl}/getReferenceLookupByKey/` + key);
  }

  getLookupTemplateEntityByShortkey(shortkey: string) {
    return this.http.get(`${environment.apiUrl}/getLookupTemplateEntityByShortkey/` + shortkey);
  }

  translatetext(targetText: string, langcode: string) {
    return this.http.get(`${environment.apiUrl}/translatetext/` + targetText + '/' + langcode + '/');
  }

   
}
