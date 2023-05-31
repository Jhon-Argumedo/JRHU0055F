import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { SesionDataEnum } from 'src/app/model/enums';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
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

    isLoading:boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
        private tipoIncService: TipoIncapacidadService,
        private appService:AppService,
        private storage: LocalStorageService,
        private toast:ToastrService) {

    }

    ngOnInit(): void {
        if(!this.appService.isUserLogged()) {
            this.toast.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

        this.findAllTipoIncapacidad();
    }

    go(tipoInc: TipoIncapacidad) {
        let requestIncapacidad = new RequestIncapacidad();
        let usuarioSesion:UsuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);
        
        requestIncapacidad.azCodigo = usuarioSesion.azCodigo;
        requestIncapacidad.contrato = Number();
        requestIncapacidad.deaCodigo = usuarioSesion.deaCodigo;
        requestIncapacidad.documentosACargar = [];
        requestIncapacidad.fechaIncidente = '';
        requestIncapacidad.fechaFueroMaterno = '';
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
        this.storage.store(SesionDataEnum.requestIncapacidad, requestIncapacidad);
        this.storage.store(SesionDataEnum.tipoIncapacidad, tipoInc);
        this.router.navigate(['/incapacidades/radicacion/radicar-incapacidad']);

        window.scroll(0, 0);
    }

    findAllTipoIncapacidad() {
        this.isLoading = true;
        this.tipoIncService.findAll().subscribe({
            next: (data) => {
                this.tiposIncList = data;
            }, 
            error: (error) => {
                console.log(error);
                this.toast.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
    });
    }
}
