import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();
    nombreUsuario:string;
    valid:boolean = true;
    azCodigo:number;
    deaCodigo:number;
    idUsuario:string;

    constructor(private router: Router,
        private storage: LocalStorageService,
        private appService:AppService) { }

    ngOnInit(): void {
        if(!this.validIsUserLogged()) {
            window.location.href = 'https://apps.genialw.com/SitioTrabajador/inicio.xhtml';
        }

        this.usuarioSesion = this.storage.retrieve('usuarioSesion');
        this.nombreUsuario = this.usuarioSesion.nombreUsuario.split(' ', 1)[0];
        this.nombreUsuario = this.capitalizeFirstLetter(this.nombreUsuario);
    }

    go(route: string) {
        this.router.navigate([route]);
        window.scroll(0, 0);
    }

    capitalizeFirstLetter(str:string) {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    validIsUserLogged() {
        return this.appService.isUserLogged();
    }
}
