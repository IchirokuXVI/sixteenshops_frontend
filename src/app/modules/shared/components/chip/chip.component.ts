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

  value?: string;
  originalValue?: string = this.value;
  visible: boolean = true;
  showPlaceholder: boolean = !this.value;
  editValue: boolean = false;

  @Input() placeholder?: string;

  @Input() disabled: boolean = false;
  @Input() editable: boolean = false;
  @Input() editDblClick: boolean = false;
  @Input() showEditButton: boolean = false;
  @Input() active: boolean = false;
  @Input() removable: boolean = false;

  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  private _onChange!: (val: boolean) => void;
  private _onTouched!: () => void;

  writeValue(value: any): void {
    this.value = value || null;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  next(event: any) {
    this.value = event.target.innerText;
    this._onChange(event.target.innerText);
    this._onTouched();
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
    this.showPlaceholder = !this.value;
    this.editValue = false;
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
