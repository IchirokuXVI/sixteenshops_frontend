import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenService } from './interceptors/token.service';
import { ConfirmationService as BaseConfirmationService, MessageService } from 'primeng/api';
import { ConfirmationService } from './services/primeng/confirmation.service';
import { SharedModule } from './modules/shared/shared.module';
import { UnauthorizedService } from './interceptors/unauthorized.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedService,
      multi: true
    },
    BsModalService,
    MessageService,
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
