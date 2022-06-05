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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

// ----------------
//     PrimeNG
// ----------------
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages'; // Por que hacen falta 2 modulos para mensajes ?
import { MessageModule } from 'primeng/message'; // Vaya cosa mas rara
import { DataViewModule } from 'primeng/dataview';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
// ConfirmPopup modified by me because it had a bug
// https://github.com/primefaces/primeng/issues/10343
// https://github.com/primefaces/primeng/issues/10285
// And more XD
// import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmPopupModule } from './components/primeng/confirmpopup/confirmpopup';

// ----------------
//     Bootstrap
// ----------------
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// ----------------
//      CUSTOM
// ----------------
import { CropperModalComponent } from './components/cropper-modal/cropper-modal.component';
import { SliderIndeterminateComponent } from './components/slider-indeterminate/slider-indeterminate.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    CropperModalComponent,
    SliderIndeterminateComponent
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
    DropdownModule,
    MatCheckboxModule,
    MatTabsModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    ConfirmPopupModule,
    MatSlideToggleModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    ToastModule,
    SliderIndeterminateComponent
  ]
})
export class SharedModule { }
