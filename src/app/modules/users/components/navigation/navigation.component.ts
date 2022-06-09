import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'users-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private _authServ: AuthService) { }

  ngOnInit(): void {
  }

  hasPermission(permission: string) {
    return this._authServ.localUserHasPermission(permission);
  }
}
