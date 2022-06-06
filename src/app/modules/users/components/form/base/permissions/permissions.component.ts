import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Permission } from 'src/app/models/permission.model';
import { User } from 'src/app/models/user.model';
import { PermissionService } from 'src/app/services/permission.service';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'usuario-form-permissions[form]',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @Input() user?: User; // Required

  @Output() loadingData: EventEmitter<boolean>;

  permissions: Permission[];
  permissionsFormArray: FormArray;

  constructor(private _permissionServ: PermissionService,
              private _authServ: AuthService) {
    this.loadingData = new EventEmitter();
    this.permissions = [];

    this.permissionsFormArray = new FormArray([]);
  }

  ngOnInit(): void {
    this.loadPermissions();

    this.form.addControl('permissions', this.permissionsFormArray);
  }

  loadPermissions() {
    this.loadingData.next(true);

    this._permissionServ.list().pipe(
      finalize(() => this.loadingData.next(false)),
    ).subscribe((permissions) => {
      this.permissions = permissions;

      for (let permission of permissions) {
        let defaultVal = null;

        if (this.user && this.user.permissions) {
          defaultVal = (this.user.permissions as any).find((item: any) => item.permission === permission._id)?.allow;
        }

        let group = new FormGroup({
          permission: new FormControl(permission._id),
          allow: new FormControl(defaultVal)
        });

        this.permissionsFormArray.push(group);

        this.hasPermission(permission.name).subscribe((has) => {
          // console.log(permission.name + " " + has)
          if (!has)
            group.disable();
          else
            group.enable();
        })
      }

      // if (this.user)
      //   this.permissionsFormArray.patchValue(this.user.permissions!);
    });
  }

  hasPermission(permission: string) {
    return this._authServ.localUserHasPermission(permission);
  }
}
