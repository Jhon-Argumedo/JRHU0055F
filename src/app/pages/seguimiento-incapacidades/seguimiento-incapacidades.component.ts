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

@Component({
    selector: 'app-seguimiento-incapacidades',
    templateUrl: './seguimiento-incapacidades.component.html',
    styleUrls: ['./seguimiento-incapacidades.component.scss']
})
export class SeguimientoIncapacidadesComponent {
    incapacidadSelected:Incapacidad;
    incapacidades:Incapacidad[] = [];

    isLoading:boolean = false;

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

        this.findAllIncapacidadesCPT();
    }

    findAllIncapacidadesCPT() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.seguimientoService.findAllIncacidades(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
                //this.incapacidades = this.incapacidades.filter(i => i.estadoObservacionTrabajador.toUpperCase().includes(EstadosPortalTrabajadorEnum.RADICADA && EstadosPortalTrabajadorEnum.EN_TRANSCRIPCION));
                this.incapacidades = this.incapacidades.filter(i => i.estado.includes(EstadosRadicadoEnum.CPT));
                console.log(data);
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
        return ['numeroRadicado', 'estadoObservacionTrabajador', 'nombreEmpresa', 'tipoIncapacidad', 'fechaInicial', 'fechaFinal', 'fechaDeRadicacion'];
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
}
