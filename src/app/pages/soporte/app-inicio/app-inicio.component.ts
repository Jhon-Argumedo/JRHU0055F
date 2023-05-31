import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { SesionDataEnum } from 'src/app/model/enums';
import { RequestContratosList } from 'src/app/model/request-contratos-list';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { ObservacionIncapacidadService } from '../../radicacion/observacion-incapacidad/observacion-incapacidad.service';
import { RadicarIncapacidadService } from '../../radicacion/radicar-incapacidad/radicar-incapacidad.service';
import { TipoIncapacidadService } from '../../radicacion/tipo-incapacidad/tipo-incapacidad.service';

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
        private localStorage: LocalStorageService) { }

    ngOnInit(): void {
        this.cleanLocalStorage();
        this.getUrlParameters();
    }

    getUrlParameters() {
        this.usuarioSesion.azCodigo = this.route.snapshot.params['az-codigo'];
        this.usuarioSesion.deaCodigo = this.route.snapshot.params['dea-codigo'];
        this.usuarioSesion.tipoDoc = this.route.snapshot.params['tipo-doc'];
        this.usuarioSesion.numeroDoc = this.route.snapshot.params['numero-doc'];
        this.usuarioSesion.nombreUsuario = this.route.snapshot.params['nombre-usuario'];
        this.usuarioSesion.tipoDocEmp = this.route.snapshot.params['tipo-doc-emp'];
        this.usuarioSesion.numeroDocEmp = this.route.snapshot.params['numero-doc-emp'];

        this.localStorage.store(SesionDataEnum.usuarioSesion, this.usuarioSesion);
        this.go('dashboard');
    }

    go(ruta: string) {
        this.router.navigate([ruta]);
        window.scroll(0, 0);
    }

    cleanLocalStorage() {
        this.localStorage.clear(SesionDataEnum.requestIncapacidad);
        this.localStorage.clear(SesionDataEnum.usuarioSesion);
        this.localStorage.clear(SesionDataEnum.tipoIncapacidad);
    }
}
