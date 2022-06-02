import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SidebarService } from 'src/app/services/sidebar.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userItems: MenuItem[];
  configItems: MenuItem[];

  loggedUser?: User;
  avatarPath?: string;

  @ViewChild('userAvatar') userAvatar!: ElementRef<HTMLImageElement>;

  constructor(private _sidebarServ: SidebarService,
              private _themeServ: ThemeService,
              private _authServ: AuthService,
              private _userServ: UserService,
              private router: Router
  ) {
    this.userItems = [];
    this.configItems = [];

    this.avatarPath = this._userServ.getAvatarPath(this._authServ.user!, 'icon');
  }

  ngOnInit(): void {
    this._authServ.$user.subscribe((user) => {
      this.loggedUser = user;
      this.reloadAvatar();
    });

    this.userItems = [
      {
        label: this.loggedUser?.email
      },
      {
        separator: true,
      },
      {
        label: 'My account',
        icon: 'pi pi-fw pi-user-edit',
        command: (event) => {
          this.router.navigate(['/users/profile']);
        }
      },
      {
        separator: true,
      },
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

  reloadAvatar() {
    // Append something to the path so it is reloaded
    if (this.userAvatar)
      this.userAvatar.nativeElement.src += "&";
  }

  public toggleSidebar(): void {
    this._sidebarServ.toggle();
  }
}
