import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  products: Product[];
  loading: boolean;

  // scroller: string;

  // page: number;
  // limit: number;

  constructor(private _productServ: ProductService) {
    this.products = [];
    this.loading = false;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    this.loading = true;
    this._productServ.list().pipe(finalize(() => this.loading = false)).subscribe((products) => this.products = products);
  }

}
