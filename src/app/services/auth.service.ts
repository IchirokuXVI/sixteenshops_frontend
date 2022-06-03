import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
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

  private accessTokenStorageName = "access_token";
  private refreshTokenStorageName = "refresh_token";

  private loggedSubject: BehaviorSubject<boolean>;
  public $logged: Observable<boolean>;

  public userSubject: BehaviorSubject<User | undefined>
  public $user: Observable<User | undefined>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.loggedSubject = new BehaviorSubject<boolean>(this.refreshToken ? true : false);
    this.$logged = this.loggedSubject.asObservable();
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.$user = this.userSubject.asObservable();
  }

  public login(email: string, password: string) {
    return this.http.post(`${this.url}/auth/login`, { email: email, password: password }).pipe(
      map((res: any) => {
        this.loggedSubject.next(true);
        this.userSubject.next(res.user);
        this.saveTokens(res.access_token, res.refresh_token);
        return res;
      })
    );
  }

  public logout(): void {
    this.removeToken();
    this.userSubject.next(undefined);
    this.loggedSubject.next(false);
    this.router.navigate(['/login']);
  }

  public setLoggedUser(user: User): void {
    this.userSubject.next(user);
  }

  public refreshTokens(): Observable<any> {
    if (this.refreshToken) {
      let customHeaders = new HttpHeaders();
      customHeaders = customHeaders.append("X-Skip-Interceptor", ''); // Custom header to skip HttpInterceptor
      customHeaders = customHeaders.append("Authorization", 'Bearer ' + this.refreshToken); // Custom header to skip HttpInterceptor
      let customOptions = { headers: customHeaders };

      return this.http.get(`${this.url}/auth/refresh`, customOptions).pipe(
        map((res: any) => {
          this.userSubject.next(res.user);
          console.log(res)
          this.saveTokens(res.access_token, res.refresh_token);
          return res;
        }),
        catchError((error: any) => {
          this.logout();
          return throwError(() => error);
        })
      );
    }

    return of(false);
  }

  public verifyToken(): Observable<boolean> {
    let token = this.accessToken;

    if (token) {
      return this.http.get(`${this.url}/auth/check`).pipe(
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

  public localUserHasPermission(permission: string): Observable<boolean> {
    return this.$user.pipe(
      map((user) => user?.permissions?.findIndex((item) => (item as Permission).name === permission) !== -1)
    )
  }

  private saveTokens(access_token: string, refresh_token: string) {
    localStorage.setItem(this.accessTokenStorageName, access_token);
    localStorage.setItem(this.refreshTokenStorageName, refresh_token);
  }

  private removeToken() {
    localStorage.removeItem(this.accessTokenStorageName);
    localStorage.removeItem(this.refreshTokenStorageName);
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.accessTokenStorageName);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageName);
  }

  get user(): User | undefined {
    return this.userSubject.value;
  }
}
