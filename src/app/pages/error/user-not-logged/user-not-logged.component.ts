import { Component } from '@angular/core';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-user-not-logged',
    templateUrl: './user-not-logged.component.html',
    styleUrls: ['./user-not-logged.component.scss']
})
export class UserNotLoggedComponent {

    goToSitioTrabajador() {
        window.open(SitioTrabajador.URL, '_blank');
    }

}
