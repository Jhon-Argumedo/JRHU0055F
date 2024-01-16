import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/model/auth.service';
import { EmpresasPrincipalesEnum, SesionDataEnum } from 'src/app/model/enums';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();
    nombreUsuario:string;
    activosEmp:boolean = false;
    serviolaEmp:boolean = false;
    atecnoEmp:boolean = false;
    valid:boolean = true;
    azCodigo:number;
    deaCodigo:number;
    idUsuario:string;

    constructor(private router: Router,
        private sessionStorage: SessionStorageService,
        private authService:AuthService,
        private toastr:ToastrService) {
            
        }

    ngOnInit(): void {
        
        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }

        this.usuarioSesion = this.sessionStorage.retrieve(SesionDataEnum.usuarioSesion);
        this.nombreUsuario = this.usuarioSesion.nombreUsuario.split(' ', 1)[0];
        this.nombreUsuario = this.capitalizeFirstLetter(this.nombreUsuario);

        if(this.usuarioSesion.nombreEmp === EmpresasPrincipalesEnum.ACTIVOS) {
            this.activosEmp = true;
        } else if(this.usuarioSesion.nombreEmp === EmpresasPrincipalesEnum.ATECNO) {
            this.atecnoEmp = true;
        } else if(this.usuarioSesion.nombreEmp === EmpresasPrincipalesEnum.SERVIOLA) {
            this.serviolaEmp = true;
        }
    }

    go(route: string) {
        this.router.navigate([route]);
        window.scroll(0, 0);
    }

    capitalizeFirstLetter(str:string) {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
}
