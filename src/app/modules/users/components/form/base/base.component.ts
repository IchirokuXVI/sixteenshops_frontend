import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CuentaComponent } from './cuenta/cuenta.component';
import { UserService } from '../../../../../services/user.service';
import { User } from 'src/app/models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'usuario-form-base[form]',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @ViewChild('formDom') formDom!: ElementRef<HTMLFormElement>;
  @ViewChild('') accountTab!: CuentaComponent;
  @Input() user?: User;
  @Input() $submitted?: BehaviorSubject<boolean>;

  selectedAvatar?: string;
  userAvatar?: Blob | string | null;

  loadingData?: boolean;

  constructor(private _userServ: UserService,
              private _modalServ: BsModalService,
              private _authServ: AuthService
  ) {  }

  ngOnInit(): void { }

  hasPermission(permission: string) {
    return this._authServ.localUserHasPermission(permission);
  }
}
