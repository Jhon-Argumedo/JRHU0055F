import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './model/auth.service';
import { SitioTrabajador } from './model/sitio-trabajador';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'Gestor de Incapacidades';
    displayError: string;

    constructor(private storage: SessionStorageService,
        private primengConfig: PrimeNGConfig) {
            
    }

    ngOnInit(): void {
        this.displayError = this.storage.retrieve('displayError');

        this.primengConfig.setTranslation({
            startsWith: 'Empieza con',
            contains: 'Contiene',
            notContains: 'No contiene',
            endsWith: 'Acaba en',
            equals: 'Igual a',
            notEquals: 'No igual a',
            noFilter: 'Sin filtro',
            lt: 'Menor que',
            lte: 'Menor o igual a',
            gt: 'Mayor que',
            gte: 'Mayor o igual a'
        });
    }
}
