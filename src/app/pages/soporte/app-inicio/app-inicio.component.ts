import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';

@Component({
    selector: 'app-app-inicio',
    templateUrl: './app-inicio.component.html',
    styleUrls: ['./app-inicio.component.scss']
})
export class AppInicioComponent {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();
    azCodigo: number;
    deaCodigo: number;
    tipoDoc: string;
    numeroDoc: string;
    nombreUsuario: string;
    tipoDocEmp: string;
    numeroDocEmp: string;

    constructor(private route: ActivatedRoute,
        private router:Router,
        private localStorage:LocalStorageService) { }

    ngOnInit(): void {
        this.cleanLocalStorage();
        this.getParameters();
        this.go();
    }

    getParameters() {
        this.azCodigo = this.route.snapshot.params['az-codigo'];
        this.deaCodigo = this.route.snapshot.params['dea-codigo'];
        this.tipoDoc = this.route.snapshot.params['tipo-doc'];
        this.numeroDoc = this.route.snapshot.params['numero-doc'];
        this.nombreUsuario = this.route.snapshot.params['nombre-usuario'];
        this.tipoDocEmp = this.route.snapshot.params['tipo-doc-emp'];
        this.numeroDocEmp = this.route.snapshot.params['numero-doc-emp'];

        this.usuarioSesion.azCodigo = this.azCodigo;
        this.usuarioSesion.deaCodigo = this.deaCodigo;
        this.usuarioSesion.tipoDoc = this.tipoDoc;
        this.usuarioSesion.numeroDoc = this.numeroDoc;
        this.usuarioSesion.nombreUsuario = this.nombreUsuario;
        this.usuarioSesion.tipoDocEmp = this.tipoDocEmp;
        this.usuarioSesion.numeroDocEmp = this.numeroDocEmp;

        this.localStorage.store('usuarioSesion', this.usuarioSesion);
    }

    go() {
        this.router.navigate(['dashboard']);
        window.scroll(0, 0);
    }

    cleanLocalStorage() {
        this.localStorage.clear("usuarioSesion");
        this.localStorage.clear("tipoInc");
    }
}
