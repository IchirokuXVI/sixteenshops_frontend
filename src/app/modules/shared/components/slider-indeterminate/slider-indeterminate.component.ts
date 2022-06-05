import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'slider-indeterminate',
  templateUrl: './slider-indeterminate.component.html',
  styleUrls: ['./slider-indeterminate.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderIndeterminateComponent),
      multi: true
    }
  ]
})
export class SliderIndeterminateComponent implements ControlValueAccessor {

  @Input() states = [null, true, false];
  @Input() label?: string;

  value: any = this.states[0];

  @Input() disabled: boolean = false;

  private _onChange!: (val: boolean) => void;
  private _onTouched!: () => void;

  writeValue(value: any): void {
    this.value = this.states.indexOf(value) !== -1 ? value : this.states[0];
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  next(value: any) {
    this.value = value;
    this._onChange(value);
    this._onTouched();
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
