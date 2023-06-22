import { Component } from '@angular/core';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    goSitioTrabajador() {
        window.open(SitioTrabajador.URL, '_blank');
    }

}
