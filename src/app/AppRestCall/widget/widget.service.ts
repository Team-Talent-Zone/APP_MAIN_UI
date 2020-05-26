import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { WidgetForService } from 'src/app/appmodels/WidgetForService';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(
    private http: HttpClient,
  ) { }

  saveWidgetService(widgetsrv: WidgetForService) {
    console.log('widgetsrv', widgetsrv);
    return this.http.post(`${environment.apiUrl}/saveWidgetService/`, widgetsrv);
  }

  saveOrUpdateWidget(widgetsrv: WidgetForService) {
    return this.http.post(`${environment.apiUrl}/saveOrUpdateWidget/`, widgetsrv);
  }

  getAllWidgetDetailsyWidgetId(widgetId: number) {
    return this.http.get(`${environment.apiUrl}/getAllWidgetDetailsyWidgetId/` + widgetId + '/');
  }
}
