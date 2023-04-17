import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from 'bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { IncapacidadesDevueltasService } from './incapacidades-devueltas.service';

@Component({
    selector: 'app-incapacidades-devueltas',
    templateUrl: './incapacidades-devueltas.component.html',
    styleUrls: ['./incapacidades-devueltas.component.scss']
})
export class IncapacidadesDevueltasComponent {
    incapacidades: Incapacidad[] = [];

    constructor(private incDevService: IncapacidadesDevueltasService,
        private toast: ToastrService) { }

    ngOnInit(): void {
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"], a[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode))

        this.findAllIncDevUser();
    }

    findAllIncDevUser() {
        this.incDevService.findAllIncDevUser().subscribe({
            next: (v) => { console.log(v); this.incapacidades = v },
            error: (e) => { this.toast.error(e.message); console.log(e) },
            complete: () => { console.log('complete') }
        });
    }
}
