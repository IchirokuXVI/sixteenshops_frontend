import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, filter, first, Observable } from 'rxjs';
import { Combination } from 'src/app/models/combination.model';
import { Product } from 'src/app/models/product.model';
import { CropperModalComponent } from 'src/app/modules/shared/components/cropper-modal/cropper-modal.component';
import { CombinationService } from 'src/app/services/combination.service';
import { ProductService } from 'src/app/services/product.service';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';

@Component({
  selector: 'product-form-base[form]',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @Input() $product?: Observable<Product | undefined>;
  product?: Product;
  @Input() $submitted?: BehaviorSubject<boolean>;

  @Output() submitProduct: EventEmitter<any> = new EventEmitter();
  @Output() submitCombination: EventEmitter<any> = new EventEmitter();
  @Output() combination: EventEmitter<Combination | undefined> = new EventEmitter();
  $combination?: Combination;

  selectedImg?: string;
  productImgs: string[];

  selectedOptions: { [key: string]: { _id: string, chip: ChipComponent } } = {};

  optionGroupsForm: FormArray;

  loadingData?: boolean;

  editingProduct: boolean;
  editingInfo: boolean;

  amountToBuy: number;

  constructor(private _productServ: ProductService,
              private _combinationServ: CombinationService,
              private _modalServ: BsModalService,
              private messageServ: MessageService,
              private sanitizer: DomSanitizer,
  ) {
    this.productImgs = [];

    this.editingProduct = true;
    this.editingInfo = false;

    this.optionGroupsForm = new FormArray([]);

    this.amountToBuy = 0;
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(), { emitEvent: false });
    this.form.addControl('price', new FormControl(), { emitEvent: false });
    this.form.addControl('discount', new FormControl(), { emitEvent: false });
    this.form.addControl('brand', new FormControl(), { emitEvent: false });
    this.form.addControl('stock', new FormControl(0), { emitEvent: false });

    this.form.addControl('images', new FormControl([]), { emitEvent: false });

    this.form.addControl('optionGroups', this.optionGroupsForm, { emitEvent: false });

    this.optionGroupsForm.valueChanges.subscribe(() => {
      console.log("value changes");

    });

    // When the first product that isn't undefined is emitted
    // change the form to editing
    this.$product?.pipe(
      filter((product) => product !== undefined),
      first()
    ).subscribe((product) => {
      this.editingProduct = true;
      this.generateOptions(product!);

      if (product!.images) {
        this.productImgs = product!.images.map((img) => this._productServ.imagesPath + "/" + product!._id + "/" + img);

        this.selectedImg = this.productImgs[0];
      }

      // Every time the product is updated patch the value of the form and update the local variable
      this.$product?.pipe(
        filter((product) => product !== undefined),
      ).subscribe((product) => {
        this.product = product;

        if (!this.$combination)
          this.form.patchValue(product!, { emitEvent: false });
      });
    });
  }

  /**
   * Generate the controls needed to display the product.
   * @param product The product that beholds the options
   */
  generateOptions(product: Product) {
    if (product && product.optionGroups) {
      for (let optionGroup of product.optionGroups) {
        let optionsControls = new FormArray([]);

        this.optionGroupsForm.push(new FormGroup({
          _id: new FormControl(),
          name: new FormControl(),
          options: optionsControls
        }), { emitEvent: false });

        if (optionGroup.options) {
          for (let option of optionGroup.options) {
            optionsControls.push(new FormGroup({
              _id: new FormControl(),
              name: new FormControl()
            }));
          }
        }
      }
    }
  }

  /**
   * Reset the info form to its previous state before editing
   */
  cancelInfo() {
    if (this.$combination){
      this.form.patchValue(this.$combination);
    } else {
      this.form.patchValue(this.product!);
    }

    this.editingInfo = false;
  }

  /**
   * Saves the info of the product, or the combination if there is one selected
   */
  saveInfo() {
    if (this.$combination)
      this.submitCombination.emit();
    else
      this.submitProduct.emit();

    this.editingInfo = false;
  }

  /**
   * Unselects all options and load the product data again
   */
  resetSelection() {
    Object.entries(this.selectedOptions).map((item) => item[1].chip.active = false);

    this.selectedOptions = { };
    this.combination.next(undefined);
    this.$combination = undefined;

    this.form.patchValue(this.product!);
  }

  /**
   * Add an option to the selected array and activate its chip to let the user know which options are selected
   * If an option of every group is selected then load the combination for that set of options
   * @param group_id Group of the option
   * @param option_id The option to select
   * @param optionChip The chip displaying the option
   */
  selectOption(group_id: string, option_id: string, optionChip: ChipComponent) {
    if (this.product && !this.editingInfo) {
      let previousSelectedOption = this.selectedOptions[group_id];

      if (previousSelectedOption)
        this.selectedOptions[group_id].chip.active = false;

      optionChip.active = true;
      this.selectedOptions[group_id] =  { _id: option_id, chip: optionChip };

      if (Object.keys(this.selectedOptions).length === this.optionGroupsForm.controls.length) {
        this._combinationServ.getByOptions(Object.entries(this.selectedOptions).map((item) => item[1]._id)).subscribe((combination) => {
          this.$combination = combination;
          this.combination.emit(combination);

          this.form.patchValue(combination, { emitEvent: false });
        });
      }
    }
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

  /**
   * Add an option to a group of options
   * @param optionGroup The group to add the option
   */
  addOption(optionGroup: AbstractControl) {
    (optionGroup.get('options') as FormArray).push(new FormGroup({ _id: new FormControl(undefined), name: new FormControl() }));
    this.submitProduct.emit();
  }

  /**
   * Remove an img from the product
   * @param index Index of the image in the array
   */
  removeImg(index: number) {
    this.productImgs.splice(index, 1);
    this.form.get('images')?.value.splice(index, 1);
  }

  /**
   * Open a modal to crop the selected image and add it to the array of images
   * @param event Input file event. Holds a reference to the selected file
   * @returns
   */
  openCropModal(event: any) {
    if (!event.target.files[0]) {
      return;
    }

    let file = event.target.files[0];
    event.target.value = null;

    if (file.size > 8 * 1024 * 1024) {
      this.messageServ.add({ severity: 'warn', summary: 'Image too big', detail: 'The selected image is too big (max 8MB)' });
      return;
    }

    // Crea una URL para el archivo que ha subido
    let objectUrl = this.sanitizeUrl(URL.createObjectURL(file));

    // Muestra el modal para recortar la imagen
    let modalRef = this._modalServ.show(CropperModalComponent, {
      initialState: {
        srcImg: objectUrl,
        aspectRatio: 1,
        rounded: true
      },
      // Prevent a bug that closes the modal when releasing click while cropping
      ignoreBackdropClick: true
    });

    // The modal component has an observable that returns the cropped image
    modalRef.content?.$resultImg.subscribe((canvas) => {
      if (canvas) {
          canvas.toBlob((blob) => {
          if (blob) {
            if (blob.size > 5 * 1024 * 1024) {
              this.messageServ.add({ severity: 'warn', summary: 'Error converting image', detail: 'The selected image went over 8MB when converting to PNG. Please select a different one' });
            } else {
              let images = this.form.get('images');
              if (images) {
                images.value[images.value.length] = blob;
              }

              this.productImgs[this.productImgs.length] = URL.createObjectURL(blob);
            }
          }
        });
      }
    });
  }

  /**
   * Sanitize an URL. Used for blob images
   * @param url Url to sanitize
   * @returns
   */
  sanitizeUrl(url?: string) {
    if (url)
      return this.sanitizer.bypassSecurityTrustUrl(url);
    return undefined;
  }
}
