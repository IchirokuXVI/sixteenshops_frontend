import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Role } from 'src/app/models/role.model';
import { PermissionService } from 'src/app/services/permission.service';
import { finalize } from 'rxjs';
import { Permission } from 'src/app/models/permission.model';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'role-modal-form-base[form]',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @ViewChild('formDom') formDom!: ElementRef<HTMLFormElement>;
  @Input() role?: Role; // Required

  permissionsFormArray: FormArray;

  loading: boolean;

  permissions: Permission[];

  canEdit: boolean = false;

  constructor(private _permissionServ: PermissionService,
              private _authServ: AuthService) {
    this.loading = false;
    this.permissions = [];

    this.permissionsFormArray = new FormArray([]);

    this._authServ.localUserHasPermission('editRole').subscribe((has) => {
      this.canEdit = has;
    });
  }

  ngOnInit(): void {
    this.loadPermissions();

    this.form.addControl('name', new FormControl());
    this.form.addControl('permissions', this.permissionsFormArray);

    if (this.role)
      this.form.patchValue(this.role);
  }

  loadPermissions() {
    this.loading = true;

    this._permissionServ.list().pipe(
      finalize(() => this.loading = true)
    ).subscribe((permissions) => {
      this.permissions = permissions;

      for (let permission of permissions) {
        let defaultVal = false;

        if (this.role && this.role.permissions) {
          defaultVal = (this.role.permissions.findIndex((item) => item === permission._id) !== -1);
        }

        this.permissionsFormArray.push(new FormGroup({
          permission: new FormControl(permission._id),
          allow: new FormControl(defaultVal)
        }));
      }
    });
  }

  hasPermission(permission: string) {
    return this._authServ.localUserHasPermission(permission);
  }
}
