import { UploadUtil } from './../../appmodels/UploadUtil';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  uploadutil: UploadUtil;
  constructor(
    private http: HttpClient,
  ) { }

  uploadAvatarsInS3(base64image: any , userId: number) {
    this.uploadutil = new UploadUtil();
    this.uploadutil.base64image = base64image;
    this.uploadutil.userid = userId;
    return this.http.post(`${environment.apiUrl}/uploadavatar/`, this.uploadutil);
  }

  uploadBgDocsInS3(base64image: any , userId: number) {
    this.uploadutil = new UploadUtil();
    this.uploadutil.base64image = base64image;
    this.uploadutil.userid = userId;
    return this.http.post(`${environment.apiUrl}/uploadbgdocs/`, this.uploadutil);
  }

  uploadWidgetPicsInS3(base64image: any , userId: number) {
    this.uploadutil = new UploadUtil();
    this.uploadutil.base64image = base64image;
    this.uploadutil.userid = userId;
    return this.http.post(`${environment.apiUrl}/uploadwidgets/`, this.uploadutil);
  }

}
