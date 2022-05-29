import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SidebarService } from 'src/app/services/sidebar.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userItems: MenuItem[];
  configItems: MenuItem[];

  constructor(private _sidebarServ: SidebarService,
              private _themeServ: ThemeService,
              private _authServ: AuthService
  ) {
    this.userItems = [];
    this.configItems = [];
  }

  ngOnInit(): void {
    this.userItems = [
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: (event) => {
          this._authServ.logout()
        }
      }
    ]

    let theme: string = '';
    this._themeServ.$theme.subscribe((value) => {
      theme = value;
    });

    this.configItems = [
      {
        label: 'Theme',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Light',
            icon: 'fas fa-sun',
            command: () => this._themeServ.setTheme('light'),
          },
          {
            label: 'Dark',
            icon: 'fas fa-moon',
            command: () => this._themeServ.setTheme('dark'),
          }
        ]
      },
    ]

  }

  public toggleSidebar(): void {
    this._sidebarServ.toggle();
  }

  get username() {
    return this._authServ.user?.email;
  }
}
