import { Injectable } from '@angular/core';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseResourceService<Permission> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'permissions';
  }
}
