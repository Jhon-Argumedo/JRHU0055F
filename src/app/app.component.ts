import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'Gestor de Incapacidades';
    displayError:string;

    constructor(private storage:LocalStorageService,
        private primengConfig:PrimeNGConfig) { }

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
