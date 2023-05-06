import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { RequestDocumento } from 'src/app/model/request-documento';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { TipoIncapacidadService } from './tipo-incapacidad.service';

@Component({
    selector: 'app-tipo-incapacidad',
    templateUrl: './tipo-incapacidad.component.html',
    styleUrls: ['./tipo-incapacidad.component.scss']
})
export class TipoIncapacidadComponent {

    tiposIncList: TipoIncapacidad[] = [];
    usuarioSesion:UsuarioSesion = new UsuarioSesion();

    constructor(private router: Router, private route: ActivatedRoute,
        private tipoIncService: TipoIncapacidadService,
        private appService:AppService,
        private storage: LocalStorageService) {

    }

    ngOnInit(): void {
        if(!this.storage.retrieve('tiposIncapacidad')) {
            this.findAllTipoIncapacidad();
        }
    }

    go(tipoInc: TipoIncapacidad) {
        let requestIncapacidad = new RequestIncapacidad();
        let usuarioSesion:UsuarioSesion = this.storage.retrieve('usuarioSesion');
        
        requestIncapacidad.azCodigo = usuarioSesion.azCodigo;
        requestIncapacidad.contrato = Number();
        requestIncapacidad.deaCodigo = usuarioSesion.deaCodigo;
        requestIncapacidad.documentosACargar = [];
        requestIncapacidad.fechaIncidente = '';
        requestIncapacidad.fechaInicioIncapacidad = '';
        requestIncapacidad.idCodigoEnfermedad = '';
        requestIncapacidad.idContigenciaIncapacidad = tipoInc.codigoTipoIncapacidad;
        requestIncapacidad.idGrupoEnfermedad = Number();
        requestIncapacidad.idSubGrupoEnfermedad = Number();
        requestIncapacidad.idSubTipoContigencia = Number();
        requestIncapacidad.idUsuarioCrea = 1;
        requestIncapacidad.numeroDeDias = Number();
        requestIncapacidad.numeroDocumentoEmpleado = parseInt(usuarioSesion.numeroDoc);
        requestIncapacidad.numeroDocumentoEmpresaPrincipal = parseInt(usuarioSesion.numeroDocEmp);
        requestIncapacidad.prorroga = '';
        requestIncapacidad.tipoACargar = 'C';
        requestIncapacidad.tipoDocumentoEmpleado = usuarioSesion.tipoDoc;
        requestIncapacidad.tipoDocumentoEmpresaPrincipal = usuarioSesion.tipoDocEmp;

        console.log(requestIncapacidad);
        this.storage.store('requestIncapacidad', requestIncapacidad);
        this.storage.store('tipoInc', tipoInc);
        this.router.navigate(['/incapacidades/radicacion/radicar-incapacidad']);

        window.scroll(0, 0);
    }

    findAllTipoIncapacidad() {
        this.tipoIncService.findAll().subscribe(data => {
            this.tiposIncList = data;
        }, error => {
            console.log(error);
            this.appService.manageError(error);
        });
    }
}
