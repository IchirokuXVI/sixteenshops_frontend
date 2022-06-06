import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(public _authService: AuthService) {
    this._authService.$refreshTokenInProgress.subscribe((inProgress) => this.refreshTokenInProgress = inProgress);
  }

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
            console.log("already refreshing")
            // Already refreshing token so we have to wait until it is refreshed
            return this._authService.$accessToken.pipe(
              filter(accessToken => accessToken !== undefined && accessToken !== null),
              take(1),
              switchMap((accessToken) => {
                request = req.clone({
                  headers: req.headers.set("Authorization", "Bearer " + accessToken)
                });
                return next.handle(request);
              })
            );
          } else {
            return this._authService.refreshTokens().pipe(
              tap(algo => console.log(algo)),
              switchMap(resp => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(resp.access_token)
                request = req.clone({
                  headers: req.headers.set("Authorization", "Bearer " + resp.access_token)
                });
                return next.handle(request);
              }),
              catchError(err => {
                if (err.status === 401) {
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
