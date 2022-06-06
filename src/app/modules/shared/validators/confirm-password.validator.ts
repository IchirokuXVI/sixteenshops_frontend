import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.parent?.get('password');
  const confirm = control;

  if (password && confirm) {
    if ((password.value === undefined || password.value === null || password.value.length === 0) && (confirm.value === undefined || confirm.value === null || confirm.value.length === 0))
      return null;

    if (password.value === confirm.value)
      return null;
  }

  return { doesntMatch: true };
};
