import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListComponent } from './components/list/list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NewComponent } from './components/form/new/new.component';
import { EditComponent } from './components/form/edit/edit.component';
import { CuentaComponent } from './components/form/base/cuenta/cuenta.component';
import { BaseComponent } from './components/form/base/base.component';
import { PermissionsComponent } from './components/form/base/permissions/permissions.component';


@NgModule({
  declarations: [
    UsersComponent,
    ListComponent,
    NavigationComponent,
    BaseComponent,
    NewComponent,
    EditComponent,
    CuentaComponent,
    PermissionsComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
