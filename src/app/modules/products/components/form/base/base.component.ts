import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CropperModalComponent } from 'src/app/modules/shared/components/cropper-modal/cropper-modal.component';
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

  selectedImg?: string;
  productImgs: string[];

  optionGroupsForm: FormArray;

  loadingData?: boolean;

  editingProduct: boolean;

  amountToBuy: number;

  constructor(private _productServ: ProductService,
              private _modalServ: BsModalService,
              private messageServ: MessageService,
              private sanitizer: DomSanitizer,
  ) {
    this.productImgs = [];

    this.editingProduct = true;

    this.optionGroupsForm = new FormArray([]);

    this.amountToBuy = 0;
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(), { emitEvent: false });
    this.form.addControl('price', new FormControl(0.00), { emitEvent: false });
    this.form.addControl('discount', new FormControl(0), { emitEvent: false });
    this.form.addControl('brand', new FormControl(), { emitEvent: false });
    this.form.addControl('stock', new FormControl(0), { emitEvent: false });

    this.form.addControl('images', new FormControl([]), { emitEvent: false });

    this.form.addControl('optionGroups', this.optionGroupsForm, { emitEvent: false });

    if (this.product) {
      this.generateOptions();

      this.form.patchValue(this.product);

      if (this.product.images) {
        this.productImgs = this.product.images.map((img) => this._productServ.imagesPath + "/" + this.product?._id + "/" + img);

        this.selectedImg = this.productImgs[0];
      }
    }
  }

  generateOptions() {
    if (this.product && this.product.optionGroups) {
      for (let optionGroup of this.product.optionGroups) {
        let optionsControls = new FormArray([]);

        this.optionGroupsForm.push(new FormGroup({
          _id: new FormControl(),
          name: new FormControl(),
          options: optionsControls
        }));

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

  removeImg(index: number) {
    this.productImgs.splice(index, 1);
    this.form.get('images')?.value.splice(index, 1);
  }

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

  sanitizeUrl(url?: string) {
    if (url)
      return this.sanitizer.bypassSecurityTrustUrl(url);
    return undefined;
  }
}
