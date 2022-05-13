import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  show: boolean; // Controla cuando se ve la sidebar
  isMobile: boolean;


  constructor(private _sidebarServ: SidebarService,
              private _authServ: AuthService,
              private breakpointObserver: BreakpointObserver) {
    this.show = true;
    this.isMobile = false;

    // Values for the Breakpoints constant
    // https://github.com/angular/components/blob/master/src/cdk/layout/breakpoints.ts
    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.XSmall
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this._sidebarServ.show.subscribe((val) => {
        this.show = val;
    });
  }

  // Llamado por la barra lateral cuando se da click en el backdrop
  // Por defecto también se cierra la barra, pero no se actualiza
  // la variable que lleva el seguimiento de si está abierta o cerrada
  closeSidebar(): void {
    this._sidebarServ.setState(false);
  }

}
