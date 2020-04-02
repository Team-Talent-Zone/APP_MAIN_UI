import { ConfigMsg } from './../AppConstants/configmsg';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // server-side error
              if (error.status === 0 || error.status === 503 || error.status === 504) {
               errorMessage = ConfigMsg.server_down;
              } else
              if (error.status === 404) {
                errorMessage = ConfigMsg.server_internal_error;
              } else {
              errorMessage = `${error.error.errormessage}`;
              }
            }
            return throwError(errorMessage);
          })
        );
    }
  }
