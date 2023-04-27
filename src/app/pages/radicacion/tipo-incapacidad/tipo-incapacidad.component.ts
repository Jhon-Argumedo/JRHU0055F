import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { TipoIncapacidadService } from './tipo-incapacidad.service';

@Component({
    selector: 'app-tipo-incapacidad',
    templateUrl: './tipo-incapacidad.component.html',
    styleUrls: ['./tipo-incapacidad.component.scss']
})
export class TipoIncapacidadComponent {

    tiposIncList: TipoIncapacidad[] = [];

    constructor(private router: Router, private route: ActivatedRoute,
        private tipoIncService: TipoIncapacidadService,
        private toast:ToastrService,
        private storage: LocalStorageService) {

    }

    ngOnInit(): void {
        this.findAllTipoIncapacidad();
    }

    go(tipoInc: TipoIncapacidad) {
        this.storage.store('tipoInc', tipoInc);
        this.router.navigate(['/incapacidades/radicacion/radicar-incapacidad']);

        window.scroll(0, 0);
    }

    findAllTipoIncapacidad() {
        this.tipoIncService.findAll().subscribe(data => {
            console.log(data);
            this.tiposIncList = data;
        }, error => {
            console.log(error);
            this.toast.error(error.message);
            this.router.navigate(['incapacidades/error']);
            window.scroll(0,0);
        });
    }
}
