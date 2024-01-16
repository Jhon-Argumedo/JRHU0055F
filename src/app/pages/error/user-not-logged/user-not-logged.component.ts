import { Component } from '@angular/core';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-user-not-logged',
    templateUrl: './user-not-logged.component.html',
    styleUrls: ['./user-not-logged.component.scss']
})
export class UserNotLoggedComponent {

    constructor(private authService:AuthService) {}

    ngOnInit(): void {
        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }
    }

    goToSitioTrabajador() {
        window.open(SitioTrabajador.URL, '_blank');
    }
    

}
