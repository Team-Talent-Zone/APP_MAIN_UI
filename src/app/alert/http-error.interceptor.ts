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
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          let errorJSON = [];
          let callTime = 1;
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            if (error.status === 503) {
              errorMessage = ConfigMsg.server_503_error;
            } else
              if (error.status === 404) {
                errorMessage = ConfigMsg.server_404_error;
              } else {
                errorMessage = `${error.error.errormessage}`;
              }
          }
          errorJSON = [{ errorMsg: errorMessage, errorcode: error.status }];
          return throwError(errorJSON);
        })
      );
  }
}
