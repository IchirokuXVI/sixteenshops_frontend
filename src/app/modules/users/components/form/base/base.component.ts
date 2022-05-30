import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario.model';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CuentaComponent } from './cuenta/cuenta.component';

@Component({
  selector: 'usuario-form-base[form]',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  @Input() form!: FormGroup; // Required
  @ViewChild('formDom') formDom!: ElementRef<HTMLFormElement>;
  @ViewChild('') tabCuenta!: CuentaComponent;
  @Input() usuario?: Usuario; // Required
  
  selectedAvatar?: string;
  userAvatar?: Blob | string | null;

  loadingData?: boolean;

  constructor(private _usuarioServ: UsuariosService,
              private _modalServ: BsModalService
  ) {  }

  ngOnInit(): void { }
}
