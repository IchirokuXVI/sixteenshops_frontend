import { NgModule } from '@angular/core';

import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './component/list/list.component';
import { BaseComponent } from './component/modal/form/base/base.component';
import { EditComponent } from './component/modal/form/edit/edit.component';
import { NewComponent } from './component/modal/form/new/new.component';


@NgModule({
  declarations: [
    ListComponent,
    BaseComponent,
    EditComponent,
    NewComponent,
  ],
  imports: [
    SharedModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
