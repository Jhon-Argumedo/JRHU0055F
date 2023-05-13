import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from 'bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { HistorialIncapacidadesService } from './historial-incapacidades.service';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { LocalStorageService } from 'ngx-webstorage';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { AppService } from 'src/app/app.service';
import { Table } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-historial-incapacidades',
    templateUrl: './historial-incapacidades.component.html',
    styleUrls: ['./historial-incapacidades.component.scss']
})
export class HistorialIncapacidadesComponent {

    incapacidadSelected:Incapacidad;
    incapacidades:Incapacidad[] = [];

    isLoading:boolean = false;

    constructor(private hIncapacidadService:HistorialIncapacidadesService,
        private toast:ToastrService,
        private storage:LocalStorageService,
        private appService:AppService,
        private modalService:NgbModal) {}

    ngOnInit(): void {
        if(!this.appService.isUserLogged()) {
            this.toast.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode));

        this.findAllInc();
    }

    findAllInc() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.hIncapacidadService.findAllInc(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
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
        let usuarioSesion:UsuarioSesion = this.storage.retrieve('usuarioSesion');
        let request:RequestIncapacidadesUsuario = new RequestIncapacidadesUsuario(usuarioSesion.tipoDoc, parseInt(usuarioSesion.numeroDoc), usuarioSesion.tipoDocEmp, parseInt(usuarioSesion.numeroDocEmp));
        return request;
    }

    getGlobalFilterFields() {
        return ['numeroRadicado', 'fechaInicial', 'fechaFinal', 'fechaDeRadicacion', 'tipoIncapacidad', 'nombreEmpresa'];
    }

    clearTable(table: Table) {
        table.clear();
    }

    filter(dtIncapacidades:any, event:any) {
        return dtIncapacidades.filterGlobal(event.target.value, 'contains')
    }

    viewDetailsIncapacidad(incapacidad:Incapacidad, modal:any) {
        this.modalService.open(modal);
        this.incapacidadSelected = incapacidad;
    }
}
