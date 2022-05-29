import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

// ----------------
//     Material
// ----------------
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// ----------------
//     PrimeNG
// ----------------
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages'; // Por que hacen falta 2 modulos para mensajes ?
import { MessageModule } from 'primeng/message'; // Vaya cosa mas rara
import { DataViewModule } from 'primeng/dataview';
import { TieredMenuModule } from 'primeng/tieredmenu';
// import { ConfirmPopupModule } from 'primeng/confirmpopup';

// ----------------
//     Bootstrap
// ----------------
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    NavbarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    TableModule,
    DataViewModule,
    TooltipModule,
    TieredMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    TableModule,
    DataViewModule,
    TooltipModule,
  ]
})
export class SharedModule { }
