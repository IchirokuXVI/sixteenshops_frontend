import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users: User[];
  loading: boolean;

  // scroller: string;

  // page: number;
  // limit: number;

  constructor(private _userServ: UserService) {
    this.users = [];
    this.loading = false;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this._userServ.list().pipe(finalize(() => this.loading = false)).subscribe((users) => this.users = users);
  }

}
