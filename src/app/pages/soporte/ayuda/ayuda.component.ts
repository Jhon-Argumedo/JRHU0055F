import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/model/auth.service';
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

    constructor(private sessionStorage:SessionStorageService,
        private toastr:ToastrService,
        private router:Router,
        private authService: AuthService) { }

    
    ngOnInit(): void {
        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }

        this.usuarioSesion = this.sessionStorage.retrieve(SesionDataEnum.usuarioSesion);
    }
    
    logoutSession() {
        this.authService.logout();
        this.sessionStorage.clear();
        this.toastr.info('Sesion cerrada correctamente');
        window.location.href = SitioTrabajador.URL;
    }

    goToCoberturaNacional() {
        window.open("https://www.activos.com.co/oficinas-activos/", '_blank');
    }

}
