import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss']
})
export class Error404Component  {

    constructor(private authService:AuthService) {}

    ngOnInit(): void {
        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }
    }
    
    goBack(): void {
        window.history.back();
    }
}
