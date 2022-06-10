import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'product-form-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  productForm: FormGroup;
  loadingSubmit: boolean;

  product?: Product;

  submitted: BehaviorSubject<boolean>;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _productServ: ProductService,
              private router: Router,
              private route: ActivatedRoute)
  {
    this.productForm = new FormGroup({});
    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._productServ.get(params['product']).subscribe((product) => {
        this.product = product;
      });
    });
  }

  submitForm(): void {
    this.submitted.next(true);
    console.log(this.productForm.value);
    if (!this.productForm.valid)
      return;

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;
    let product: Product = {
      _id: this.product?._id,
      ...this.productForm.value
    };

    this._productServ.update(product, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/products"]);
    });
  }

}
