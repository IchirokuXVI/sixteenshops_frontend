import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ListComponent } from './components/list/list.component';
import { NavigationComponent } from './components/navigation/navigation.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,
    NavigationComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
