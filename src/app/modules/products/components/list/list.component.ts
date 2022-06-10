import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { catchError, finalize, throwError } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { ConfirmationService } from 'src/app/services/primeng/confirmation.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../services/auth.service';

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

  constructor(private _productServ: ProductService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService
  ) {
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

  deleteProduct(btn: MatButton, product: Product, index: number): void {
    // Timeout de cero como workaround
    setTimeout(() => {
      this.confirmationService.confirmDelete({
        target: <EventTarget><unknown>btn._elementRef.nativeElement,
        message: '¿Do you really want to delete this product?',
        accept: () => {
          this.iconTrashToSpin(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);

          btn._elementRef.nativeElement.style.pointerEvents = "none";

          this._productServ.delete(product._id!).pipe(
            finalize(() => {
              this.iconSpinToTrash(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);
              btn._elementRef.nativeElement.style.pointerEvents = "auto";
            }),
            catchError((error: any): any => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Couldn\'t delete product' });
              throwError(() => error);
            })
          ).subscribe((res) => {
            this.products.splice(index, 1);
          });
        },
        reject: () => {
            //reject action
            console.log("reject")
        }
      });
    });
  }

  private iconSpinToTrash(icon: any) {
    icon.classList.remove("fa-spinner", "fa-spin", "text-secondary");
    icon.classList.add("fa-trash", "text-danger");
  }

  private iconTrashToSpin(icon: any) {
    icon.classList.remove("fa-trash", "text-danger");
    icon.classList.add("fa-circle-notch", "fa-spin", "text-secondary");
  }
}
