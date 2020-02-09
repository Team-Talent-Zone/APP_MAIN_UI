import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService  implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

       req = req.clone({
        setHeaders: {
          Authorization: 'Basic cmVzdHNlcnZpY2ViYXNpY2F1dGh1c2VyOlRMIzIwMTdAUkVTVCo4MzI0NjMkIw=='
        }
      });
       return next.handle(req);
 }
}
