import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.parent?.get('password');
  const confirm = control;

  return password && confirm && password.value === confirm.value ? null : { isMatching: false };
};