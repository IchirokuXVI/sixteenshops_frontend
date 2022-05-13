import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { confirmPassword } from 'src/app/modules/shared/validators/confirm-password.validator';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: boolean = true;
  form: FormGroup;

  constructor(private _authServ: AuthService,
              private _userServ: UserService,
              private router: Router) {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: Validators.required
      }),
      password: new FormControl('', {
        validators: Validators.required
      })
    });

    // Confirm password input won't be invalid/valid if you first fill confirm and then password so
    // this way we are forcing it to re-evalidate when password changes
    this.form.controls['password'].valueChanges.subscribe(() => {
      if (!this.login) {
        this.form.controls['passwordConfirm'].updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
  }

  public sendForm(form: FormGroup) {
    if (form.valid) {
      if (this.login) {
        this.sendLogin(form.value.email, form.value.password);
      } else {
        this.sendRegister(form.value);
      }
    }
  }

  private sendLogin(email: string, password: string) {
    this._authServ.login(email, password).subscribe({
      next: () => this.router.navigate(["/dashboard"]),
      error: () => $('#formError').text("Invalid username or password")
    });
  }

  private sendRegister(user: User) {
    $('#confirmPasswordError').text("");
    this._userServ.create(user).subscribe({
      next: () => {
        $('#formMessage').text("User successfully created");
        $('.is-invalid').removeClass('is-invalid');
        this.form.removeControl("passwordConfirm");
        this.login = true;
      },
      error: () => {
        console.log("asdasd")
        $('#emailInput').addClass("is-invalid");
      }
    });
  }

  public secondButtonClick(): void {
    this.login = !this.login;
    if (!this.login) {
      this.form.addControl("passwordConfirm", new FormControl('', {
          validators: confirmPassword,
          updateOn: 'change'
        })
      )
    } else {
      this.form.removeControl("passwordConfirm");
    }
    this.form.reset();
    $('#formError').text("");
    $('#formMessage').text("");
  }

}
