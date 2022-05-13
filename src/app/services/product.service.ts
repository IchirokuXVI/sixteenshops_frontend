import { Injectable } from '@angular/core';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseResourceService<Product> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'products';
  }
}
