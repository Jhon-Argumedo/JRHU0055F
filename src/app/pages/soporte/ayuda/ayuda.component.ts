import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { SesionDataEnum } from 'src/app/model/enums';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';

@Component({
    selector: 'app-ayuda',
    templateUrl: './ayuda.component.html',
    styleUrls: ['./ayuda.component.scss']
})
export class AyudaComponent {

    usuarioSesion:UsuarioSesion;

    constructor(private localStorage:LocalStorageService,
        private toastr:ToastrService,
        private router:Router) { }

    
    ngOnInit(): void {
        this.usuarioSesion = this.localStorage.retrieve(SesionDataEnum.usuarioSesion);
    }
    
    logoutSession() {
        this.localStorage.clear();
        this.toastr.info('Sesion cerrada correctamente');
        window.location.href = SitioTrabajador.URL;
    }

    goToCoberturaNacional() {
        window.open("https://www.activos.com.co/oficinas-activos/", '_blank');
    }

}
