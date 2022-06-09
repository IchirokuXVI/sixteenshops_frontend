import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role.model';
import { catchError, finalize, throwError } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { ConfirmationService } from 'src/app/services/primeng/confirmation.service';
import { NewComponent } from '../modal/form/new/new.component';
import { EditComponent } from '../modal/form/edit/edit.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  loading: boolean;

  roles: Role[];

  constructor(private _roleServ: RoleService,
              private _modalServ: BsModalService,
              private confirmationService: ConfirmationService,
              private _authServ: AuthService
  ) {
    this.loading = false;
    this.roles = [];
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    // Load data needed for the form
    this.loading = true;
    this._roleServ.list().pipe(
      finalize(() => this.loading = false)
    ).subscribe((roles) => {
      // Cannot replace array because it has one option by default
      this.roles = roles;
    });
  }

  openModalAdd() {
    let modalRef = this._modalServ.show(NewComponent, {
      class: 'modal-lg',
    });

    modalRef.content?.$saved.subscribe((saved) => saved ? this.loadRoles() : '');
  }

  openModalUpdate(role: Role) {
    let modalRef = this._modalServ.show(EditComponent, {
      class: 'modal-lg',
      initialState: {
        role_id: role._id
      }
    });

    modalRef.content?.$edited.subscribe((edited) => edited ? this.loadRoles() : '');
  }

  deleteRole(btn: MatButton, role: Role, index: number): void {
    // Timeout de cero como workaround
    setTimeout(() => {
      this.confirmationService.confirmDelete({
        target: <EventTarget><unknown>btn._elementRef.nativeElement,
        message: '¿Do you really want to delete this role?',
        accept: () => {
          this.iconTrashToSpin(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);

          btn._elementRef.nativeElement.style.pointerEvents = "none";

          this._roleServ.delete(role._id!).pipe(
            finalize(() => {
              this.iconSpinToTrash(btn._elementRef.nativeElement.getElementsByTagName('svg')[0]);
              btn._elementRef.nativeElement.style.pointerEvents = "auto";
            }),
            catchError((error: any): any => {
              alert("Couldn't delete role");
              throwError(() => error);
            })
          ).subscribe((res) => {
            this.roles.splice(index, 1);
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

  hasPermission(permission: string) {
    return this._authServ.localUserHasPermission(permission);
  }
}
