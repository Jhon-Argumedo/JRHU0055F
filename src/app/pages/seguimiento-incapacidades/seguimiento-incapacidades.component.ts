import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Table } from 'primeng/table';
import { AppService } from 'src/app/app.service';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { SeguimientoIncapacidadesService } from './seguimiento-incapacidades.service';
import { SesionDataEnum } from 'src/app/model/enums';
import { Observacion } from 'src/app/model/observacion';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
    selector: 'app-seguimiento-incapacidades',
    templateUrl: './seguimiento-incapacidades.component.html',
    styleUrls: ['./seguimiento-incapacidades.component.scss']
})
export class SeguimientoIncapacidadesComponent {

    defaultTextFilterMode = 'contains';
    usuarioSesion: UsuarioSesion = new UsuarioSesion();
    incapacidadSelected: Incapacidad;
    incapacidades: Incapacidad[] = [];
    numeroRadicadoSeleccionado: number;
    isLoadingObservaciones: boolean = false;
    isLoading: boolean = false;
    observacionesConsulta: Observacion[] = [];
    matchModeOptions: SelectItem[];

    constructor(private seguimientoService: SeguimientoIncapacidadesService,
        private toast: ToastrService,
        private storage: LocalStorageService,
        private appService: AppService,
        private modalService: NgbModal,
        private router: Router) { }

    ngOnInit(): void {
        if (!this.appService.isUserLogged()) {
            this.toast.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

        this.usuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);

        this.generateMatchModeOptions();
        this.findAllIncapacidadesCPT();
    }

    generateMatchModeOptions() {
        this.matchModeOptions = [
            { label: 'Comienza con', value: 'startsWith' },
            { label: 'Contiene', value: 'contains' },
            { label: 'No contiene', value: 'notContains' },
            { label: 'Termina en', value: 'endsWith' },
            { label: 'Igual', value: 'equals' },
            { label: 'Diferente', value: 'notEquals' },
        ];
    }

    findAllIncapacidadesCPT() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.seguimientoService.findAllIncacidades(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
                this.incapacidades.forEach(inc => {
                    let dateFechaRadicacion: Date = new Date(inc.fechaRadicacion);
                    let dateFechaInicial: Date = new Date(inc.fechaInicial);
                    let dateFechaFinal: Date = new Date(inc.fechaFinal);

                    let formattedFechaRadicacion: string = dateFechaRadicacion.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    let formattedFechaInicial: string = dateFechaInicial.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    let formattedFechaFinal: string = dateFechaFinal.toLocaleDateString('es-CO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    inc.fechaRadicacion = formattedFechaRadicacion;
                    inc.fechaInicial = formattedFechaInicial;
                    inc.fechaFinal = formattedFechaFinal;
                });
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

    buildRequestIncapacidadesUsuario(): RequestIncapacidadesUsuario {
        let usuarioSesion: UsuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);
        let request: RequestIncapacidadesUsuario = new RequestIncapacidadesUsuario(usuarioSesion.tipoDoc, parseInt(usuarioSesion.numeroDoc), usuarioSesion.tipoDocEmp, parseInt(usuarioSesion.numeroDocEmp));
        return request;
    }

    clearTable(table: Table) {
        table.clear();
    }

    viewDetailsIncapacidad(incapacidad: Incapacidad, modal: any) {
        this.modalService.open(modal, { centered: true });
        this.incapacidadSelected = incapacidad;
    }

    viewObservacionesIncapacidad(incapacidad: Incapacidad, modal: any) {
        this.observacionesConsulta = [];
        this.modalService.open(modal, { centered: true });
        this.findObservacionesByNumeroRadicado(incapacidad.numeroRadicado);
    }

    findObservacionesByNumeroRadicado(radicado: number) {
        this.numeroRadicadoSeleccionado = radicado;
        this.isLoadingObservaciones = true;
        this.observacionesConsulta = [];
        this.seguimientoService.findObservacionesByNumeroRadicado(radicado).subscribe({
            next: (data) => {
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

    refreshComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
    }

}
