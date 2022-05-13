import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(public _authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.has("X-Skip-Interceptor")) return next.handle(req);
    let request = req.clone();
    if (this._authService.accessToken) {
      request = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + this._authService.accessToken)
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Probably the token expired so try to refresh it first
        if (error && error.status === 401 && this._authService.refreshToken) {
          if (this.refreshTokenInProgress) {
            // Already refreshing token so we have to wait until it is refreshed
            return this.refreshTokenSubject.pipe(
              filter(accessToken => accessToken !== null),
              take(1),
              switchMap((accessToken) => {
                request = req.clone({
                  headers: req.headers.set("Authorization", "Bearer " + accessToken)
                });
                return next.handle(request);
              })
            );
          } else {
            this.refreshTokenInProgress = true;
            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);

            return this._authService.refreshTokens().pipe(
              switchMap(resp => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(resp.access_token)
                request = req.clone({
                  headers: req.headers.set("Authorization", "Bearer " + resp.access_token)
                });
                console.log("tokenRefreshed");
                return next.handle(request);
              }),
              catchError(err => {
                if (err.status === 401) {
                  this.refreshTokenInProgress = false;
                  this._authService.logout();
                }
                return throwError(() => err);
              })
            )
          }
        } else {
          return throwError(() => error);
        }
      })
    ) as Observable<HttpEvent<any>>;
  }
}
