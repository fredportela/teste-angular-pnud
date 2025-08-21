import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through successful requests', () => {
    const request = new HttpRequest('GET', '/users');
    const response = { status: 200, body: {} } as any;
    
    mockHandler.handle.and.returnValue(of(response));

    interceptor.intercept(request, mockHandler).subscribe(event => {
      expect(event).toEqual(response);
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
  });

  it('should handle HTTP 400 errors', () => {
    const request = new HttpRequest('POST' as any, '/users');
    const errorResponse = new HttpErrorResponse({
      error: 'Bad Request',
      status: 400,
      statusText: 'Bad Request'
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, mockHandler).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Bad Request', 'OK', { duration: 2000 });
  });

  it('should handle HTTP 401 errors', () => {
    const request = new HttpRequest('GET', '/users');
    const errorResponse = new HttpErrorResponse({
      error: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized'
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, mockHandler).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Unauthorized', 'OK', { duration: 2000 });
  });

  it('should handle HTTP 404 errors', () => {
    const request = new HttpRequest('GET', '/users/999');
    const errorResponse = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found'
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, mockHandler).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Not Found', 'OK', { duration: 2000 });
  });

  it('should handle HTTP 500 errors', () => {
    const request = new HttpRequest('GET', '/users');
    const errorResponse = new HttpErrorResponse({
      error: 'Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, mockHandler).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Internal Server Error', 'OK', { duration: 2000 });
  });

  it('should handle timeout errors', () => {
    const request = new HttpRequest('GET', '/users');
    const errorResponse = new HttpErrorResponse({
      error: 'Timeout',
      status: 0,
      statusText: 'Timeout'
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(request, mockHandler).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(request);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Http failure response for (unknown url): 0 Timeout', 'OK', { duration: 2000 });
  });

});
