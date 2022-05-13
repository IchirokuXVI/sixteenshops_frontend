import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _sidebarServ: SidebarService) { }

  ngOnInit(): void {
  }

  public toggleSidebar(): void {
    this._sidebarServ.toggle();
  }
}
