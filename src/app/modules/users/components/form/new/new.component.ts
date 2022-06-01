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

  usuarioForm: FormGroup;
  loadingSubmit: boolean;

  submitted: BehaviorSubject<boolean>;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _usuarioServ: UserService,
              private router: Router)
  {
    this.usuarioForm = new FormGroup({});
    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void { }

  submitForm(): void {
    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();
    this.submitted.next(true);

    if (!this.usuarioForm.valid)
      return;

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;
    let user: User = {
      ...this.usuarioForm.value
    };

    this._usuarioServ.create(user, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/users"]);
    });
  }
}
