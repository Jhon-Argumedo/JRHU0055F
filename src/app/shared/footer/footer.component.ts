import { Component } from '@angular/core';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    anio: number = new Date().getFullYear();

    goSitioTrabajador() {
        window.open(SitioTrabajador.URL, '_blank');
    }
}
