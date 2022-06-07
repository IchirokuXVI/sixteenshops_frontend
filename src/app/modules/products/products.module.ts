import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ListComponent } from './components/list/list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BaseComponent } from './components/form/base/base.component';
import { EditComponent } from './components/form/edit/edit.component';
import { NewComponent } from './components/form/new/new.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,
    NavigationComponent,
    BaseComponent,
    EditComponent,
    NewComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
