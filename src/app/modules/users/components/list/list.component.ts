import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { catchError, finalize, throwError } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { ConfirmationService } from 'src/app/services/primeng/confirmation.service';

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

  constructor(private _userServ: UserService,
              private confirmationService: ConfirmationService
  ) {
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

  deleteUser(btn: MatButton, user: User, index: number): void {
    // Timeout de cero como workaround
    setTimeout(() => {
      this.confirmationService.confirmDelete({
        target: <EventTarget><unknown>btn._elementRef.nativeElement,
        message: '¿Do you really want to delete this user?',
        accept: () => {
          this.iconTrashToSpin(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);

          btn._elementRef.nativeElement.style.pointerEvents = "none";

          this._userServ.delete(user._id!).pipe(
            finalize(() => {
              this.iconSpinToTrash(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);
              btn._elementRef.nativeElement.style.pointerEvents = "auto";
            }),
            catchError((error: any): any => {
              alert("Couldn't delete user");
              throwError(() => error);
            })
          ).subscribe((res) => {
            this.users.splice(index, 1);
          });
        },
        reject: () => {
            //reject action
            console.log("reject")
        }
      });
    });
  }

  private iconSpinToTrash(icon: any) {
    icon.classList.remove("fa-spinner", "fa-spin", "text-secondary");
    icon.classList.add("fa-trash", "text-danger");
  }

  private iconTrashToSpin(icon: any) {
    icon.classList.remove("fa-trash", "text-danger");
    icon.classList.add("fa-circle-notch", "fa-spin", "text-secondary");
  }

  public getAvatarPath(user: User) {
    return this._userServ.getAvatarPath(user, 'avatar');
  }
}
