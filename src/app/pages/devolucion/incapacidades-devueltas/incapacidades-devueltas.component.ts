import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from 'bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { IncapacidadesDevueltasService } from './incapacidades-devueltas.service';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { EstadosPortalTrabajadorEnum, SesionDataEnum } from 'src/app/model/enums';
import { SessionStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { Table } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observacion } from 'src/app/model/observacion';
import { SeguimientoIncapacidadesService } from '../../seguimiento-incapacidades/seguimiento-incapacidades.service';
import { SelectItem } from 'primeng/api';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-incapacidades-devueltas',
    templateUrl: './incapacidades-devueltas.component.html',
    styleUrls: ['./incapacidades-devueltas.component.scss']
})
export class IncapacidadesDevueltasComponent {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();
    incapacidades: Incapacidad[] = [];
    incapacidadSelected: Incapacidad;
    isLoading:boolean = false;
    numeroRadicadoSeleccionado:number;
    isLoadingObservaciones:boolean = false;
    observacionesConsulta:Observacion[] = [];
    defaultTextFilterMode = 'contains';
    matchModeOptions: SelectItem[];

    constructor(private incDevService: IncapacidadesDevueltasService,
        private toast: ToastrService,
        private sessionStorage:SessionStorageService,
        private appService:AppService,
        private modalService:NgbModal,
        private router:Router,
        private seguimientoService:SeguimientoIncapacidadesService,
        private authService:AuthService) { }

    ngOnInit(): void {

        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }

        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"], a[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode))

        
        this.usuarioSesion = this.sessionStorage.retrieve(SesionDataEnum.usuarioSesion);
        this.findAllIncapacidadesPEN();
    }

    findAllIncapacidadesPEN() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.incDevService.findAllIncacidades(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
                this.incapacidades = this.incapacidades.filter(i => i.estadoObservacionTrabajador.includes(EstadosPortalTrabajadorEnum.Devolución));
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

    buildRequestIncapacidadesUsuario():RequestIncapacidadesUsuario {
        let usuarioSesion:UsuarioSesion = this.sessionStorage.retrieve(SesionDataEnum.usuarioSesion);
        let request:RequestIncapacidadesUsuario = new RequestIncapacidadesUsuario(usuarioSesion.tipoDoc, parseInt(usuarioSesion.numeroDoc), usuarioSesion.tipoDocEmp, parseInt(usuarioSesion.numeroDocEmp));
        return request;
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

    convertStringFirstCapitalLetter(str:string) {
        return this.appService.convertStringFirstCapitalLetter(str);
    }

    goCargarDocumentos(incapacidad:Incapacidad) {
        this.sessionStorage.store(SesionDataEnum.incapacidadDevuelta, incapacidad);
        this.router.navigate(['/incapacidades/devolucion/documentos-devolucion/' + incapacidad.numeroRadicado]);
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

    refreshComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.router.url]);
    }
}
