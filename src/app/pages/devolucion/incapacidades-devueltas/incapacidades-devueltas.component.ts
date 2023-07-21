import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from 'bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { IncapacidadesDevueltasService } from './incapacidades-devueltas.service';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { EstadosPortalTrabajadorEnum, EstadosRadicadoEnum, SesionDataEnum } from 'src/app/model/enums';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { Table } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

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

    constructor(private incDevService: IncapacidadesDevueltasService,
        private toast: ToastrService,
        private storage:LocalStorageService,
        private appService:AppService,
        private modalService:NgbModal,
        private router:Router) { }

    ngOnInit(): void {
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"], a[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode))

        
        this.usuarioSesion = this.storage.retrieve(SesionDataEnum.usuarioSesion);
        this.findAllIncapacidadesPEN();
    }

    findAllIncapacidadesPEN() {
        this.isLoading = true;
        let request = this.buildRequestIncapacidadesUsuario();
        this.incDevService.findAllIncacidades(request).subscribe({
            next: (data) => {
                this.incapacidades = data;
                //this.incapacidades = this.incapacidades.filter(i => i.estadoObservacionTrabajador.toUpperCase().includes(EstadosPortalTrabajadorEnum.DEVOLUCION));
                this.incapacidades = this.incapacidades.filter(i => i.estado.includes(EstadosRadicadoEnum.PEN));
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
        return ['numeroRadicado', 'fechaInicial', 'fechaFinal', 'fechaDeRadicacion', 'tipoIncapacidad', 'nombreEmpresa'];
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
        this.storage.store(SesionDataEnum.incapacidadDevuelta, incapacidad);
        this.router.navigate(['/incapacidades/devolucion/documentos-devolucion/' + incapacidad.numeroRadicado]);
    }
}
