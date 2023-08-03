import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { AppService } from 'src/app/app.service';
import { EstadosPortalTrabajadorEnum, EstadosRadicadoEnum } from 'src/app/model/enums';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { SeguimientoIncapacidadesService } from './seguimiento-incapacidades.service';
import { SesionDataEnum } from 'src/app/model/enums';
import { Observacion } from 'src/app/model/observacion';

@Component({
    selector: 'app-seguimiento-incapacidades',
    templateUrl: './seguimiento-incapacidades.component.html',
    styleUrls: ['./seguimiento-incapacidades.component.scss']
})
export class SeguimientoIncapacidadesComponent {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();
    incapacidadSelected:Incapacidad;
    incapacidades:Incapacidad[] = [];

    numeroRadicadoSeleccionado:number;
    isLoadingObservaciones:boolean = false;

    isLoading:boolean = false;
    observacionesConsulta:Observacion[] = [];

    constructor(private seguimientoService:SeguimientoIncapacidadesService,
        private toast:ToastrService,
        private storage:LocalStorageService,
        private appService:AppService,
        private modalService:NgbModal) {}

    ngOnInit(): void {
        if(!this.appService.isUserLogged()) {
            this.toast.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

        this.usuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);

        this.findAllIncapacidadesCPT();
    }

    findAllIncapacidadesCPT() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.seguimientoService.findAllIncacidades(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
                console.log(this.incapacidades);
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

    buildRequestIncapacidadesUsuario():RequestIncapacidadesUsuario {
        let usuarioSesion:UsuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);
        let request:RequestIncapacidadesUsuario = new RequestIncapacidadesUsuario(usuarioSesion.tipoDoc, parseInt(usuarioSesion.numeroDoc), usuarioSesion.tipoDocEmp, parseInt(usuarioSesion.numeroDocEmp));
        return request;
    }

    getGlobalFilterFields() {
        return ['numeroRadicado', 'estadoObservacionTrabajador', 'nombreEmpresa', 'tipoIncapacidad', 'subTipoIncapacidad', 'fechaInicial', 'fechaFinal', 'fechaRadicacion'];
    }

    clearTable(table: Table) {
        table.clear();
    }

    filter(dtIncapacidades:any, event:any) {
        return dtIncapacidades.filterGlobal(event.target.value, 'contains')
    }

    viewDetailsIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.modalService.open(modal, { centered: true });
        this.incapacidadSelected = incapacidad;
    }

    viewObservacionesIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.observacionesConsulta = [];
        this.modalService.open(modal, { centered: true });
        this.findObservacionesByNumeroRadicado(incapacidad.numeroRadicado);
    }

    findObservacionesByNumeroRadicado(radicado:number) {
        console.log(radicado);
        this.numeroRadicadoSeleccionado = radicado;
        this.isLoadingObservaciones = true;
        this.observacionesConsulta = [];
        this.seguimientoService.findObservacionesByNumeroRadicado(radicado).subscribe({
            next: (data) => {
                console.log(data);
                this.observacionesConsulta = data;
            },
            error: (error) => {
                console.log(error);
                this.toast.error(error.message);
                this.appService.manageHttpError(error);
            }, 
            complete: () => {
                this.isLoadingObservaciones = false;
            }
        });
    }
}
