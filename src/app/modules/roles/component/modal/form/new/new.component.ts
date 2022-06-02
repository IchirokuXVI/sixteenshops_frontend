import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { RoleService } from 'src/app/services/role.service';
import { BaseComponent } from '../base/base.component';
import { first, finalize } from 'rxjs';
import { Role } from 'src/app/models/role.model';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  roleForm: FormGroup;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  loadingSubmit: boolean;
  private saved: Subject<boolean>;
  $saved: Observable<boolean>;

  constructor(public bsModalRef: BsModalRef,
              private _roleServ: RoleService
  ) {
    this.roleForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });

    this.loadingSubmit = false;
    this.saved = new Subject();
    this.$saved = this.saved.asObservable().pipe(first());

    this.bsModalRef.onHide?.subscribe(() => this.saved.next(false));
  }

  ngOnInit(): void {
  }

  submitForm() {
    console.log(this.roleForm.value)

    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();

    if (!this.roleForm.valid)
      return;

    this.loadingSubmit = true;

    let permissions = [];

    for (let permission of this.roleForm.get('permissions')?.value) {
      if (permission.allow)
        permissions.push(permission.permission);
    }

    let role: Role = {
      ...this.roleForm.value,
      permissions: permissions
    };

    this._roleServ.create(role).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.saved.next(true);
      this.bsModalRef.hide();
    });
  }

}
