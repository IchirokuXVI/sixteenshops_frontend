import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, throwError, debounceTime, finalize, filter, mergeMap, switchMap, tap, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = environment.apiUrl;

  private refreshTokenInProgress: BehaviorSubject<boolean>;
  public $refreshTokenInProgress: Observable<boolean>;

  private accessTokenStorageName = "access_token";
  private refreshTokenStorageName = "refresh_token";

  private refreshTokenSubject: BehaviorSubject<string | undefined>;
  public $refreshToken: Observable<string | undefined>;

  private accessTokenSubject: BehaviorSubject<string | undefined>;
  public $accessToken: Observable<string | undefined>;

  private loggedSubject: BehaviorSubject<boolean>;
  public $logged: Observable<boolean>;

  public userSubject: BehaviorSubject<User | undefined>
  public $user: Observable<User | undefined>;

  constructor(private http: HttpClient,
              private router: Router
    ) {
    this.refreshTokenInProgress = new BehaviorSubject<boolean>(false);
    this.$refreshTokenInProgress = this.refreshTokenInProgress.asObservable();

    this.refreshTokenSubject = new BehaviorSubject<string | undefined>(this.refreshToken || undefined);
    this.$refreshToken = this.refreshTokenSubject.asObservable();

    this.accessTokenSubject = new BehaviorSubject<string | undefined>(this.accessToken || undefined);
    this.$accessToken = this.accessTokenSubject.asObservable();

    this.loggedSubject = new BehaviorSubject<boolean>(this.refreshToken ? true : false);
    this.$logged = this.loggedSubject.asObservable();

    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.$user = this.userSubject.asObservable();

    this.$user.subscribe((user) => console.log(user));
  }

  public register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/register`, { email: email, password: password });
  }

  /**
   * Tries to login a user with the given credentials
   * If the login is successful then the service saves the user data returned by the server
   * @param email Email of the user
   * @param password Password of the user
   * @returns Observable with the server response
   */
  public login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, { email: email, password: password }).pipe(
      map((res: any) => {
        this.loggedSubject.next(true);
        this.userSubject.next(res.user);
        this.saveTokens(res.access_token, res.refresh_token);
        return res;
      })
    );
  }

  /**
   * Closes the user session by removing all his saved information and requesting a logout on the API
   * The logout request revokes his current refresh token so it can't be used again
   */
  public logout(): void {
    // The server needs the refresh token to revoke it
    let customHeaders = new HttpHeaders();
    customHeaders = customHeaders.append("X-Skip-Interceptor", ''); // Custom header to skip TokenInterceptor
    customHeaders = customHeaders.append("Authorization", 'Bearer ' + this.refreshToken); // Set refresh token in authorization header
    let customOptions = { headers: customHeaders };

    this.http.post(`${this.url}/auth/logout`, undefined, customOptions).subscribe();

    this.removeTokens();
    this.userSubject.next(undefined);
    this.loggedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Refresh the access token and get a new refresh token
   * @returns Observable with the response from the server
   */
  public refreshTokens(): Observable<any> {
    return this.$refreshToken.pipe(
      filter((token) => token !== undefined && token !== null),
      mergeMap((token) => {
        let customHeaders = new HttpHeaders();
        customHeaders = customHeaders.append("X-Skip-Interceptor", ''); // Custom header to skip TokenInterceptor
        customHeaders = customHeaders.append("Authorization", 'Bearer ' + token); // Set refresh token in authorization header
        let customOptions = { headers: customHeaders };

        this.refreshTokenInProgress.next(true);
        this.accessTokenSubject.next(undefined);
        this.refreshTokenSubject.next(undefined);

        return this.http.post(`${this.url}/auth/refresh`, undefined, customOptions).pipe(
          map((res: any) => {
            this.userSubject.next(res.user);
            this.saveTokens(res.access_token, res.refresh_token);
            return res;
          }),
          catchError((error: any) => {
            this.logout();
            return throwError(() => error);
          }),
          finalize(() => {
            console.log("Token refreshed " + new Date());
            this.refreshTokenInProgress.next(false);
          })
        )
      }, 1),
      first()
    );
  }

  /**
   * Requests a check to the server to get the token info
   * @returns Observable with a boolean indicating wether the token is valid or not
   */
  public verifyToken(): Observable<boolean> {
    let token = this.accessToken;

    if (token) {
      return this.http.get(`${this.url}/auth/check`).pipe(
        // Map the response to a boolean so it can be used in AuthGuard
        map((res: any) => {
          if (res) {
            this.userSubject.next(res);
            this.loggedSubject.next(true);
            return true;
          } else {
            this.logout();
            return false;
          }
        }),
        catchError((error: any) => {
          this.logout();
          return throwError(() => error);
        })
      );
    }

    // If there isn't a token saved then logout
    this.logout();
    return of(false);
  }

  /**
   * Checks if the user has a permission
   * @param permission The permission to find. It could be the permission id or the permission name
   * @returns Observable<boolean> mapped from the user observable. Doesn't emit a new value if the permission allowance didn't change
   */
  public localUserHasPermission(permission: string): Observable<boolean> {
    return this.$user.pipe(
      map((user) => user?.permissions?.findIndex((item) => (item as Permission).name === permission || (item as Permission)._id === permission) !== -1),
      distinctUntilChanged()
    );
  }

  /**
   * Saves the access and refresh tokens to the local storage
   * @param access_token The access token to save
   * @param refresh_token The refresh token to save
   */
  private saveTokens(access_token: string, refresh_token: string) {
    this.accessTokenSubject.next(access_token);
    this.refreshTokenSubject.next(refresh_token);

    localStorage.setItem(this.accessTokenStorageName, access_token);
    localStorage.setItem(this.refreshTokenStorageName, refresh_token);
  }

  /**
   * Removes access and refresh tokens from the local storage
   */
  private removeTokens() {
    this.accessTokenSubject.next(undefined);
    this.refreshTokenSubject.next(undefined);

    localStorage.removeItem(this.accessTokenStorageName);
    localStorage.removeItem(this.refreshTokenStorageName);
  }

  /**
   * Get the access token from the local storage
   */
  get accessToken(): string | null {
    return localStorage.getItem(this.accessTokenStorageName);
  }

  /**
   * Get the refresh token from the local storage
   */
  get refreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageName);
  }

  /**
   * Get the currently logged user. It is recommended to use the observable instead of this
   */
  get user(): User | undefined {
    return this.userSubject.value;
  }
}
