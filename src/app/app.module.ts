import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenService } from './interceptors/token.service';
import { ConfirmationService as BaseConfirmationService } from 'primeng/api';
import { ConfirmationService } from './services/primeng/confirmation.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    },
    BsModalService,
    ConfirmationService,
    {
      // Cuando se vaya a usar un ConfirmationService original
      // se cambia por una instancia ya existente del modificado
      // Esto hace falta porque los componentes de PrimeNG
      // utilizan el servicio original internamente
      provide: BaseConfirmationService,
      useExisting: ConfirmationService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
