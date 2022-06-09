import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipComponent),
      multi: true
    }
  ]
})
export class ChipComponent implements ControlValueAccessor {

  @ViewChild('inputValue') inputValue!: ElementRef<HTMLDivElement>;

  value?: any;
  originalValue?: any = this.value;
  visible: boolean = true;
  showPlaceholder: boolean = true;
  editValue: boolean = false;

  @Input() placeholder?: string;
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step: number = 1;

  @Input() disabled: boolean = false;
  @Input() editable: boolean = false;
  @Input() editDblClick: boolean = false;
  @Input() showEditButton: boolean = false;
  @Input() selectable: boolean = false;
  @Input() active: boolean = false;
  @Input() background: boolean = true;
  @Input() removable: boolean = false;
  @Input() number: boolean = false;
  @Input() showDecreaseIncrease: boolean = false;

  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  private _onChange!: (val: boolean) => void;
  private _onTouched!: () => void;

  writeValue(value: any): void {
    this.value = value;
    if (this.validValue()) {
      this.showPlaceholder = false;
      this.originalValue = value;
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  next(value: any): boolean {
    let invalid = false;
    if (value.toString().length > 0 && this.number) {
      value = parseInt(value);

      if (isNaN(value) || (this.min !== undefined && value < this.min) || (this.max !== undefined && value > this.max))
        invalid = true;
    }

    if (invalid) {
      console.log("invalid");

      // Reset the value to before the user changed it
      this.inputValue.nativeElement.innerText = this.value;
      return false;
    }

    this.value = value;
    this._onChange(value);
    this._onTouched();

    return true;
  }

  increase() {
    if (this.max && this.value > this.max)
    return;

    let value = parseInt(this.value);

    if (isNaN(value))
      value = 0;

    if (this.next(value = value + this.step))
      this.inputValue.nativeElement.innerText = value.toString(10);
  }

  decrease() {
    if (this.min && this.value < this.min)
    return;

    let value = parseInt(this.value);

    if (isNaN(value))
      value = 0;

    if (this.next(value = value - this.step))
      this.inputValue.nativeElement.innerText = value.toString(10);
  }

  inputValueEvent(event: any) {
    this.next(event.target.innerText);
  }

  focusValueEditSingle() {
    if (this.editable && this.showPlaceholder) {
      this.focusValueEdit();
    }
  }

  focusValueEditDouble() {
    if (this.editable && this.editDblClick) {
      this.focusValueEdit();
    }
  }

  focusValueEdit() {
    this.showPlaceholder = false;
    this.editValue = true;
    setTimeout(() => this.inputValue.nativeElement.focus())
  }

  chipBlur() {
    this.showPlaceholder = !this.validValue();
    this.editValue = false;
  }

  validValue() {
    return this.value != null && this.value != undefined && this.value !== '' || (this.number && !isNaN(this.value));
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  remove() {
    this.visible = false;
    this.onRemove.emit();
  }
}
