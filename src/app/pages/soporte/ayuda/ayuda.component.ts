import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-ayuda',
    templateUrl: './ayuda.component.html',
    styleUrls: ['./ayuda.component.scss']
})
export class AyudaComponent {

    constructor(private localStorage:LocalStorageService,
        private toastr:ToastrService) { }
    
    logoutSession() {
        this.localStorage.clear();
        this.toastr.warning('Sesion cerrada correctamente');
        window.open(SitioTrabajador.URL);
    }

    goToCoberturaNacional() {
        window.open("https://www.activos.com.co/oficinas-activos/", '_blank');
    }

}
