import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'product-form-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  productForm: FormGroup;
  loadingSubmit: boolean;

  submitted: BehaviorSubject<boolean>;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _productServ: ProductService,
              private router: Router)
  {
    this.productForm = new FormGroup({});
    this.loadingSubmit = false;
    this.submitted = new BehaviorSubject<boolean>(false);
  }

  ngOnInit(): void { }

  submitForm(): void {
    this.submitted.next(true);

    if (!this.productForm.valid)
      return;

    if (this.baseComp.loadingData) {
      alert('Form still loading data');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;
    let product: Product = {
      ...this.productForm.value
    };

    this._productServ.create(product, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/products"]);
    });
  }

}
