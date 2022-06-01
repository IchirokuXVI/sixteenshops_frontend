import { Injectable } from '@angular/core';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseResourceService<Role> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'roles';
  }
}
