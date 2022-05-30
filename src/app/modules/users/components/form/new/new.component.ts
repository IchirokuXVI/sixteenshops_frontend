import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  usuarioForm: FormGroup;
  loadingSubmit: boolean;

  @ViewChild(BaseComponent) baseComp!: BaseComponent;

  constructor(private _usuarioServ: UsuariosService,
              private router: Router)
  {
    this.usuarioForm = new FormGroup({});
    this.loadingSubmit = false;
  }

  ngOnInit(): void { }

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
    let usuario: Usuario = {
      ...this.usuarioForm.value
    };

    this._usuarioServ.create(usuario, true).pipe(
      finalize(() => this.loadingSubmit = false)
    ).subscribe(() => {
      this.router.navigate(["/usuarios"]);
    });
  }
}
