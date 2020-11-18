import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor(
    private userService: UserService
  ) { }

   intercept(req: HttpRequest<any>, next: HttpHandler) {
        req = req.clone({
         setHeaders: {
          Authorization: 'Basic cmVzdHNlcnZpY2ViYXNpY2F1dGh1c2VyOlRMIzIwMTdAUkVTVCo4MzI0NjMkIw=='
         }
       });
        return next.handle(req); 
  }
/*
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (localStorage.getItem('currentUser') != null) {
      console.log('============1============');
      const authReq = req.clone({
        // tslint:disable-next-line: max-line-length
        headers: new HttpHeaders({
          Authorization: 'Basic ' +
            btoa(this.userService.currentUserValue.username + ':' + localStorage.getItem('currentPwd'))
        })
      });
      return next.handle(authReq);
    } else
      if (localStorage.getItem('currentUser') == null && req.url.indexOf('findByUsername') === -1) {
        console.log('============2============');
        const defaultauth = req.clone({
          setHeaders: {
            Authorization: 'Basic VzRVQmFzaWNBdXRob3JpemF0aW9uOlc0VSMyMDIxQFJFU1QqIz9kWHB0cT9wOVYzV05MIVAkIw=='
          }
        });
        return next.handle(defaultauth);
      } else {
        console.log('============3============');
        const xhr = req.clone({
          headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
        });
        return next.handle(xhr);
      }
  }*/
}
