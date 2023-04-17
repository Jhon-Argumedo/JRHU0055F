import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tooltip } from 'bootstrap';
import { Incapacidad } from 'src/app/model/incapacidad';
import { HistorialIncapacidadesService } from './historial-incapacidades.service';

@Component({
    selector: 'app-historial-incapacidades',
    templateUrl: './historial-incapacidades.component.html',
    styleUrls: ['./historial-incapacidades.component.scss']
})
export class HistorialIncapacidadesComponent {

    incapacidades:Incapacidad[] = [];

    constructor(private hIncapacidadService:HistorialIncapacidadesService,
        private toast:ToastrService) {}

    ngOnInit(): void {
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode));

        this.findAllInc();
    }

    findAllInc() {
        this.hIncapacidadService.findAllInc().subscribe({
            next: (v) => {console.log(v); this.incapacidades = v},
            error: (e) => {this.toast.error(e.message); console.log(e)},
            complete: () => {console.log('complete')} 
        });
    }
}
