import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
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
        private localStorage: LocalStorageService,
        private tipoIncService:TipoIncapacidadService,
        private appService:AppService,
        private radicarService:RadicarIncapacidadService,
        private observacionService:ObservacionIncapacidadService) { }

    ngOnInit(): void {
        this.cleanLocalStorage();
        this.getUrlParameters();
        this.loadData();
    }

    loadData() {
        this.getTiposIncapacidad();
        this.getContratosUsuario();
        this.getEnfermedades();
        this.getTerminoCondicionesHTML();
    }

    getUrlParameters() {
        this.usuarioSesion.azCodigo = this.route.snapshot.params['az-codigo'];
        this.usuarioSesion.deaCodigo = this.route.snapshot.params['dea-codigo'];
        this.usuarioSesion.tipoDoc = this.route.snapshot.params['tipo-doc'];
        this.usuarioSesion.numeroDoc = this.route.snapshot.params['numero-doc'];
        this.usuarioSesion.nombreUsuario = this.route.snapshot.params['nombre-usuario'];
        this.usuarioSesion.tipoDocEmp = this.route.snapshot.params['tipo-doc-emp'];
        this.usuarioSesion.numeroDocEmp = this.route.snapshot.params['numero-doc-emp'];

        this.localStorage.store('usuarioSesion', this.usuarioSesion);
        this.go('dashboard');
    }

    go(ruta: string) {
        this.router.navigate([ruta]);
        window.scroll(0, 0);
    }

    cleanLocalStorage() {
        this.localStorage.clear('displayError');
        this.localStorage.clear("incapacidad");
        this.localStorage.clear("usuarioSesion");
        this.localStorage.clear("tipoInc");
    }

    getTiposIncapacidad() {
        this.tipoIncService.findAll().subscribe(data => {
            this.localStorage.store('subtiposIncapacidad', data);
        }, error => {
            console.log(error);
            this.appService.manageError(error);
        });
    }

    getContratosUsuario() {
        this.radicarService.findAllContratos(new RequestContratosList(this.usuarioSesion.tipoDoc, parseInt(this.usuarioSesion.numeroDoc),
            this.usuarioSesion.tipoDocEmp, parseInt(this.usuarioSesion.numeroDocEmp))).subscribe(data => {
            this.localStorage.store('contratosUsuario', data);
        }, error => {
            console.log(error);
            this.appService.manageError(error);
        });
    }

    getEnfermedades() {
        this.radicarService.findAllEnfermedades().subscribe(data => {
            this.localStorage.store('enfermedades', data);
        }, error => {
            console.log(error);
            this.appService.manageError(error);
        });
    }

    getTerminoCondicionesHTML() {
        this.observacionService.getObservacionText().subscribe(data => {
            this.localStorage.store('terminosCondiciones', data);
        }, error => {
            console.log(error);
            this.appService.manageError(error);
        });
    }
}
