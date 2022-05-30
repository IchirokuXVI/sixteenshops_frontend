import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  usuarioForm: FormGroup;
  loadingSubmit: boolean;

  usuario?: Usuario;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _usuarioServ: UsuariosService,
              private route: ActivatedRoute,
              private router: Router)
  {
    this.usuarioForm = new FormGroup({});
    this.loadingSubmit = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._usuarioServ.get(params['usuario']).subscribe((usuario) => this.usuario = usuario)
    });
  }

  submitForm(): void {
    // Triggers a submit event on the form
    this.baseComp.formDom.nativeElement.requestSubmit();

    if (!this.usuarioForm.valid)
      return;
    
    if (this.baseComp.loadingData) {
      alert('El formulario aún está cargando algunos datos');
      return; // TO-DO show message indicating why the submit didn't fire (still loading data)
    }

    this.loadingSubmit = true;

    let updatedUsuario: any = {
      _id: this.usuario?._id,
      ...this.usuarioForm.value,
    };

    // Elimina el campo avatar si no ha sido actualizado (para evitar subir de nuevo el avatar)
    if (this.usuarioForm.get('avatar')?.value === this.usuario?.avatar) {
      delete updatedUsuario.avatar;
    }

    this._usuarioServ.update(updatedUsuario, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/usuarios"]);
    });
  }

}
