import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListComponent } from './components/list/list.component';
import { NavigationComponent } from './components/navigation/navigation.component';


@NgModule({
  declarations: [
    UsersComponent,
    ListComponent,
    NavigationComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
