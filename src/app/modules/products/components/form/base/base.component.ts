import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-form-base[form]',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @Input() product?: Product;
  @Input() $submitted?: BehaviorSubject<boolean>;

  optionGroupsForm: FormArray;

  loadingData?: boolean;

  editingProduct: boolean;

  constructor(private _productServ: ProductService
  ) {
    this.editingProduct = true;

    this.optionGroupsForm = new FormArray([]);
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(), { emitEvent: false });
    this.form.addControl('price', new FormControl(0.00), { emitEvent: false });
    this.form.addControl('discount', new FormControl(0), { emitEvent: false });
    this.form.addControl('brand', new FormControl(), { emitEvent: false });
    this.form.addControl('stock', new FormControl(0), { emitEvent: false });

    this.form.addControl('optionGroups', this.optionGroupsForm, { emitEvent: false });
  }

  addOptionGroup() {
    this.optionGroupsForm.push(new FormGroup({ name: new FormControl(), options: new FormArray([]) }));
  }

  deleteOptionGroup(index: number) {
    this.optionGroupsForm.removeAt(index);
  }

  getOptionGroups() {
    return this.optionGroupsForm.controls;
  }

  getOptionGroupOptions(optionGroup: AbstractControl) {
    return optionGroup.get('options') as FormArray;
  }

  deleteOptionGroupOption(optionGroup: AbstractControl, index: number) {
    (optionGroup.get('options') as FormArray).removeAt(index);
  }

  addOption(optionGroup: AbstractControl) {
    (optionGroup.get('options') as FormArray).push(new FormGroup({ name: new FormControl() }));
  }

}
