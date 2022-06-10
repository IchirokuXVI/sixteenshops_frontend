import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { Combination } from 'src/app/models/combination.model';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { BaseComponent } from '../base/base.component';
import { CombinationService } from '../../../../../services/combination.service';

@Component({
  selector: 'product-form-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  productForm: FormGroup;
  loadingSubmit: boolean;

  product: BehaviorSubject<Product | undefined>;
  $product: Observable<Product | undefined>;

  combination?: Combination;

  submitted: BehaviorSubject<boolean>;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _productServ: ProductService,
              private _combinationServ: CombinationService,
              private router: Router,
              private route: ActivatedRoute)
  {
    this.productForm = new FormGroup({});

    this.product = new BehaviorSubject<Product | undefined>(undefined);
    this.$product = this.product.asObservable();

    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._productServ.get(params['product']).subscribe((product) => {
        this.product?.next(product);
      });
    });
  }

  submitProduct(): void {
    this.submitted.next(true);

    if (!this.productForm.valid) {
      return;
    }

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;

    let formValue;
    let isMultipart = false;

    if (this.combination) {
      formValue = this.productForm.get('optionGroups')!.value;
    } else {
      formValue = this.productForm.value;
      isMultipart = true;
    }

    let updatedProduct: Product = {
      _id: this.product.value?._id,
      ...formValue
    };

    this._productServ.update(updatedProduct, isMultipart).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this._productServ.get(this.product!.value!._id!).subscribe((product) => {
        this.product.next(product);
      });
    });
  }

  submitCombination() {
    this.submitted.next(true);

    if (!this.productForm.valid) {
      return;
    }

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;

    let updatedCombination: Combination = {
      _id: this.combination?._id,
      ...this.productForm.value
    };

    this._combinationServ.update(updatedCombination).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      console.log("SAVED COMBINATION");
    });
  }

  selectCombination(combination?: Combination) {
    this.combination = combination;
  }
}
