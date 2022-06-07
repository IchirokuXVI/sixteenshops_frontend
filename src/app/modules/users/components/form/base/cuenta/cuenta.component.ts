import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, finalize, Observable, of, timer, switchMap, map, BehaviorSubject } from 'rxjs';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { CropperModalComponent } from 'src/app/modules/shared/components/cropper-modal/cropper-modal.component';
import { confirmPassword } from 'src/app/modules/shared/validators/confirm-password.validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'usuario-form-cuenta[form]',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @Input() user?: User; // Required

  @Output() loadingData: EventEmitter<boolean>;

  @ViewChild('cropperModal') cropperModal!: any;
  @ViewChild('copperImg') cropperImg!: ElementRef<HTMLImageElement>

  roles: Role[];
  imgLoading: boolean;
  defaultAvatars: string[];
  selectedAvatar: string;
  userAvatar?: Blob | string | null;

  inputUser: FormControl;
  @Input() $submitted?: BehaviorSubject<boolean>;

  avatarStorage: string;

  selectedRole?: string;

  constructor(private _roleServ: RoleService,
              private _userServ: UserService,
              private _modalServ: BsModalService,
              private sanitizer: DomSanitizer,
              private messageServ: MessageService
  ) {
    this.loadingData = new EventEmitter();
    this.imgLoading = false;

    this.avatarStorage = this._userServ.defaultAvatarsPath;

    this.defaultAvatars = [
      "user.png",
      "avatar1.png",
      "avatar2.png",
      "avatar3.png",
      "avatar4.png",
      "avatar5.png",
      "avatar6.png",
      "avatar7.png",
      "avatar8.png",
      "avatar9.png",
      "avatar10.png",
    ];

    this.defaultAvatars = this.defaultAvatars.map((avatar) => this.avatarStorage + avatar);

    this.inputUser = new FormControl('', Validators.required);

    this.selectedAvatar = this.defaultAvatars[0];

    this.roles = [];
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(), { emitEvent: false });
    this.form.addControl('email', new FormControl('', Validators.required, this.uniqueEmail()), { emitEvent: false });

    let passwordControl;

    // Only required for new users
    if (this.user)
      passwordControl = new FormControl();
    else
      passwordControl = new FormControl(null, Validators.required);

    this.form.addControl('password', passwordControl, { emitEvent: false });
    this.form.addControl('passwordConfirm', new FormControl(null, { validators: confirmPassword, updateOn: 'change' }), { emitEvent: false });
    this.form.addControl('role', new FormControl(), { emitEvent: false });
    this.form.addControl('avatar', new FormControl(), { emitEvent: false });

    this.selectAvatar(this.defaultAvatars[0]);

    if (this.user) {
      this.form.patchValue(this.user);

      if (this.user.avatar)
        this.selectAvatar(this.avatarStorage + this.user.avatar);
      else
        this.selectedAvatar = this._userServ.getAvatarPath(this.user);
    }

    // Load data needed for the form
    this.loadingData.next(true);
    forkJoin(
      {
        roles: this._roleServ.list()
      }
    ).pipe(
      finalize(() => this.loadingData.next(false))
    ).subscribe((data) => {
      // Cannot replace array because it has one option by default
      this.roles = data.roles;

      if (this.user) {
        setTimeout(() => this.form.get('role')?.setValue(this.user?.role, { emitEvent: false }))
      }
    });
  }

  updateValidity(control: AbstractControl | null) {
    control?.updateValueAndValidity();
  }

  updatePermissions(event: any) {
    // Changed the logic so this isn't needed anymore
    // It used to update the user permissions so it had the same as the selected role
    // if (this.user) {
    //   let role = this.roles.find((item) => item._id == event.value);

    //   for (let control of (this.form.get('permissions') as FormArray).controls) {
    //     if (event.value && role && role.permissions)
    //       control.patchValue({ allow: role.permissions.findIndex((item) => item == control.value.permission) !== -1 });
    //     else
    //       control.patchValue({ allow: false })
    //   }
    // }
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    let avatarPath = avatar.split("/");
    this.userAvatar = avatarPath[avatarPath.length - 1];
    this.form.get('avatar')?.setValue(this.userAvatar);
  }

  selectUploadedAvatar(event: any) {
    if (!event.target.files[0]) {
      return;
    }

    let file = event.target.files[0];
    event.target.value = null;

    if (file.size > 5 * 1024 * 1024) {
      this.messageServ.add({ severity: 'warn', summary: 'Image too big', detail: 'The selected image is too big (max 5MB)' });
      return;
    }

    // Crea una URL para el archivo que ha subido
    let objectUrl = this.sanitizeUrl(URL.createObjectURL(file));

    // Muestra el modal para recortar la imagen
    let modalRef = this._modalServ.show(CropperModalComponent, {
      initialState: {
        srcImg: objectUrl,
        aspectRatio: 1,
        rounded: true
      },
      // Prevent a bug that closes the modal when releasing click while cropping
      ignoreBackdropClick: true
    });

    // The modal component has an observable that returns the cropped image
    modalRef.content?.$resultImg.subscribe((canvas) => {
      if (canvas) {
        this.imgLoading = true;
        canvas.toBlob((blob) => {
          if (blob) {
            if (blob.size > 5 * 1024 * 1024) {
              this.messageServ.add({ severity: 'warn', summary: 'Error converting image', detail: 'The selected image went over 5MB when converting to PNG. Please select a different one' });
            } else {
              this.userAvatar = blob;
              this.form.get('avatar')?.setValue(blob);
              this.selectedAvatar = URL.createObjectURL(blob);
            }
          }

          this.imgLoading = false;
        });
      }
    });
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      // If the input wasn't modified then don't check if it is valid
      if (control.pristine || control.value == this.user?.email)
        return of(null);

      return timer(500).pipe(switchMap(()=>{
        return this._userServ.checkEmail(control.value).pipe(
          map((taken) => taken ? { uniqueEmail: "Email is already in use" } : null),
        );
      }));
    }
  }

  // Another alternative to validate unique username. Works well and it is maybe easier to understand
  // uniqueUsername(): AsyncValidatorFn {
  //   return (control): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
  //     // Si no se ha llegado a modificar el input no puede ser inválido
  //     if (control.pristine || control.value == this.usuario?.userName)
  //       return of(null);

  //     return control.valueChanges.pipe(
  //       distinctUntilChanged(),
  //       debounceTime(350),
  //       switchMap((value) => this._usuarioServ.checkUser(value)),
  //       map((taken: boolean) => {
  //         return taken ? { uniqueUsername: "Nombre de usuario en uso" } : null;
  //       }),
  //       first()
  //     )
  //   }
  // }

  get submitted() {
    return this.$submitted?.value;
  }
}
