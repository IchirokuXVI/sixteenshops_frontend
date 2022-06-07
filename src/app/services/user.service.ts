import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BaseResourceService } from './base-resource.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<User> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'users';
  }
  
  public profile(): Observable<User> {
    return this.http.get<User>(this.baseUrl + "/" + this.endpoint + "/profile");
  }

  public checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + "/" + this.endpoint + "/checkEmail", { params: { email: email } });
  }

  public getAvatarPath(user: User, size: string = 'standard', resolution?: number): string {
    let path = this.baseUrl  + "/" + this.endpoint + "/" + user._id + "/avatar";

    path += "?size=" + size;

    if (resolution)
      path += "&resolution=" + resolution;

    return path;
  }

  get defaultAvatarsPath(): string {
    return this.baseUrl + "/defaultAvatars/";
  }
}
