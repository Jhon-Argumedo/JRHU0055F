import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/model/auth.service';
import { PrincipalesConst } from 'src/app/model/constantes';
import { SesionDataEnum } from 'src/app/model/enums';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';

@Component({
    selector: 'app-app-inicio',
    templateUrl: './app-inicio.component.html',
    styleUrls: ['./app-inicio.component.scss']
})
export class AppInicioComponent {

    usuarioSesion: UsuarioSesion = new UsuarioSesion();
    azCodigo: string;
    deaCodigo: string;
    tipoDoc: string;
    numeroDoc: string;
    nombreUsuario: string;
    tipoDocEmp: string;
    numeroDocEmp: string;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.getUrlParameters();
    }

    getUrlParameters() {
        this.sessionStorage.clear();
        
        this.usuarioSesion.azCodigo = this.route.snapshot.params['az-codigo'];
        this.usuarioSesion.deaCodigo = this.route.snapshot.params['dea-codigo'];
        this.usuarioSesion.tipoDoc = this.route.snapshot.params['tipo-doc'];
        this.usuarioSesion.numeroDoc = this.route.snapshot.params['numero-doc'];
        this.usuarioSesion.nombreUsuario = this.route.snapshot.params['nombre-usuario'];
        this.usuarioSesion.tipoDocEmp = this.route.snapshot.params['tipo-doc-emp'];
        this.usuarioSesion.numeroDocEmp = this.route.snapshot.params['numero-doc-emp'];

        PrincipalesConst.forEach(pc => {
            if(this.usuarioSesion.numeroDocEmp.match(pc.nit)) {
                this.usuarioSesion.nombreEmp = pc.nombre;
            }
        });

        this.sessionStorage.store(SesionDataEnum.usuarioSesion, this.usuarioSesion);
        this.authService.login();
        this.go('dashboard');
    }

    go(ruta: string) {
        this.router.navigate([ruta]);
        window.scroll(0, 0);
    }
}
