import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { UserService } from '../../../../../services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'user-form-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  userForm: FormGroup;
  loadingSubmit: boolean;

  submitted: BehaviorSubject<boolean>;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _userServ: UserService,
              private router: Router)
  {
    this.userForm = new FormGroup({});
    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void { }

  submitForm(): void {
    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();
    this.submitted.next(true);

    if (!this.userForm.valid)
      return;

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;
    let user: User = {
      ...this.userForm.value
    };

    this._userServ.create(user, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/users"]);
    });
  }
}
