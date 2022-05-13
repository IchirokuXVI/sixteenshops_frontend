import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService<User> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'users';
  }
}
