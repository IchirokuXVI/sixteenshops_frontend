import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { UserService } from '../../../../../services/user.service';
import { User } from 'src/app/models/user.model';
import { BaseComponent } from '../base/base.component';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'user-form-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  userForm: FormGroup;
  loadingSubmit: boolean;

  user?: User;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;
  submitted: BehaviorSubject<boolean>;

  profile: boolean;

  constructor(private _userServ: UserService,
              private _authServ: AuthService,
              private route: ActivatedRoute,
              private messageServ: MessageService,
              private router: Router)
  {
    this.userForm = new FormGroup({});
    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
    this.profile = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let $user: Observable<User>;
      if (!params['id']) {
        this.profile = true;
        $user = this._userServ.profile();
      } else {
        $user = this._userServ.get(params['id']);
      }

      $user.subscribe((user) => this.user = user)
    });
  }

  submitForm(): void {
    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();
    this.submitted.next(true);

    if (!this.userForm.valid)
      return;

    if (this.baseComp.loadingData) {
      alert('El formulario aún está cargando algunos datos');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;

    let updatedUser: any = {
      _id: this.user?._id,
      ...this.userForm.value,
    };

    // Delete avatar field if it wasn't modified
    if (this.userForm.get('avatar')?.value === this.user?.avatar) {
      delete updatedUser.avatar;
    }

    this._userServ.update(updatedUser, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.messageServ.add({ severity: 'success', summary: 'Success', detail: 'User saved' });
      if (this._authServ.user?._id == updatedUser._id) {
        // Refresh tokens because the user info might have changed
        this._authServ.refreshTokens().subscribe();
      }
    });
  }

  get avatarPath() {
    return this._userServ.getAvatarPath(this._authServ.user!, 'icon');
  }

}

