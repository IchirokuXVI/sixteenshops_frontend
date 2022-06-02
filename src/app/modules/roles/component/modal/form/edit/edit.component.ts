import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Observable, first, finalize } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  roleForm: FormGroup;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  loadingSubmit: boolean;
  private edited: Subject<boolean>;
  $edited: Observable<boolean>;
  role?: Role;

  // Passed in modal init parameters
  role_id!: string;

  constructor(public bsModalRef: BsModalRef,
              private _roleServ: RoleService
  ) {
    this.roleForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });

    this.loadingSubmit = false;
    this.edited = new Subject();
    this.$edited = this.edited.asObservable().pipe(first());

    this.bsModalRef.onHide?.subscribe(() => this.edited.next(false));
  }

  ngOnInit(): void {
    this._roleServ.get(this.role_id).subscribe((role) => this.role = role);
  }

  submitForm() {
    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();

    if (!this.roleForm.valid)
      return;

    this.loadingSubmit = true;

    let permissions = [];

    console.log(this.roleForm.get('permissions')?.value)

    for (let permission of this.roleForm.get('permissions')?.value) {
      if (permission.allow)
        permissions.push(permission.permission);
    }

    let role: Role = {
      _id: this.role!._id,
      ...this.roleForm.value,
      permissions: permissions
    };

    this._roleServ.update(role).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.edited.next(true);
      this.bsModalRef.hide();
    });
  }

}
