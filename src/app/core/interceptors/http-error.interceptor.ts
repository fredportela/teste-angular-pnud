import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(private snack: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('HTTP Error:', err.message, err);

        const errorMessage = err.error?.message || err.message || 'Ocorreu um erro inesperado.';
        this.snack.open(errorMessage, 'OK', { duration: 2000 });
        return throwError(() => err);
      })
    );
  }
}
