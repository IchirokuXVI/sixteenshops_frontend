import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, finalize, Observable, of, timer, switchMap, map } from 'rxjs';
import { Perfil } from 'src/app/model/perfil.model';
import { Usuario } from 'src/app/model/usuario.model';
import { CropperModalComponent } from 'src/app/module/shared/component/cropper-modal/cropper-modal.component';
import { PerfilesService } from 'src/app/service/perfiles.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'usuario-form-cuenta[form]',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @Input() usuario?: Usuario; // Required

  @Output() loadingData: EventEmitter<boolean>;

  @ViewChild('cropperModal') cropperModal!: any;
  @ViewChild('copperImg') cropperImg!: ElementRef<HTMLImageElement>

  perfiles: Perfil[];
  imgLoading: boolean;
  defaultAvatars: string[];
  selectedAvatar?: string;
  userAvatar?: Blob | string | null;

  inputUser: FormControl;

  avatarStorage: string;

  constructor(private _perfilServ: PerfilesService,
              private _usuarioServ: UsuariosService,
              private _modalServ: BsModalService,
              private sanitizer: DomSanitizer
  ) {
    this.loadingData = new EventEmitter();
    this.imgLoading = false;

    this.avatarStorage = this._usuarioServ.avatarStoragePath;

    this.defaultAvatars = [
      this.avatarStorage + "user.png",
      this.avatarStorage + "avatar1.png",
      this.avatarStorage + "avatar2.png",
      this.avatarStorage + "avatar3.png",
      this.avatarStorage + "avatar4.png",
      this.avatarStorage + "avatar5.png",
      this.avatarStorage + "avatar6.png",
      this.avatarStorage + "avatar7.png",
      this.avatarStorage + "avatar8.png",
      this.avatarStorage + "avatar9.png",
      this.avatarStorage + "avatar10.png",
    ];

    this.inputUser = new FormControl('', Validators.required);

    this.perfiles = [
      {
        nombre: 'Sin perfil',
      }
    ];
  }

  ngOnInit(): void {
    this.form.addControl('nombre', new FormControl(), { emitEvent: false });
    this.form.addControl('userName', new FormControl('', Validators.required, this.uniqueUsername()), { emitEvent: false });

    let passwordControl;

    // Solo requerido si es un nuevo usuario
    if (this.usuario)
      passwordControl = new FormControl();
    else
      passwordControl = new FormControl('', Validators.required);

    this.form.addControl('password', passwordControl, { emitEvent: false });
    this.form.addControl('email', new FormControl(), { emitEvent: false });
    this.form.addControl('perfil', new FormControl(), { emitEvent: false });
    this.form.addControl('isAdmin', new FormControl(), { emitEvent: false });
    this.form.addControl('avatar', new FormControl(), { emitEvent: false });

    this.selectAvatar(this.defaultAvatars[0]);

    if (this.usuario) {
      this.form.patchValue(this.usuario);

      if (this.usuario.avatar)
        this.selectAvatar(this.avatarStorage + this.usuario.avatar);
    }

    // Load data needed for the form
    this.loadingData.next(true);
    forkJoin(
      {
        perfiles: this._perfilServ.list()
      }
    ).pipe(
      finalize(() => this.loadingData.next(false))
    ).subscribe((data) => {
      // Cannot replace array because it has one option by default
      this.perfiles.push(...data.perfiles);

      if (this.usuario) {
        this.form.get('perfil')?.setValue(this.usuario.perfil?._id);
      }
    });
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
      alert("Imagen demasiado grande (5MB max)");
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

    // El modal tiene un observable que devuelve la imagen recortada
    modalRef.content?.$resultImg.subscribe((canvas) => {
      if (canvas) {
        this.imgLoading = true;
        canvas.toBlob((blob) => {
          if (blob) {
            this.userAvatar = blob;
            this.form.get('avatar')?.setValue(blob);
            this.selectedAvatar = URL.createObjectURL(blob);
            this.imgLoading = false;
          }
        });
      }
    });
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  uniqueUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      // Si no se ha llegado a modificar el input no puede ser inválido
      if (control.pristine || control.value == this.usuario?.userName)
        return of(null);

      return timer(500).pipe(switchMap(()=>{
        return this._usuarioServ.checkUser(control.value).pipe(
          map((taken) => taken ? { uniqueUsername: "Nombre de usuario en uso" } : null),
        )
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
}
