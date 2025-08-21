import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(private snack: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;

        if (error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else if (error.status === 0 && error.statusText === 'Timeout') {
          errorMessage = error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Ocorreu um erro inesperado.';
        }

        this.snack.open(errorMessage, 'OK', { duration: 2000 });
        return throwError(() => error);
      })
    );
  }
}
