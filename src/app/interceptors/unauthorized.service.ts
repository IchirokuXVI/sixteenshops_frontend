import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class UnauthorizedService implements HttpInterceptor {
  constructor(private messageService: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have enough privileges for that' })
        }
        return throwError(() => error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}
