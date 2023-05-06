import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'Gestor de Incapacidades';
    displayError:string;

    constructor(private storage:LocalStorageService) { }

    ngOnInit(): void {
        this.displayError = this.storage.retrieve('displayError');
    }
}
