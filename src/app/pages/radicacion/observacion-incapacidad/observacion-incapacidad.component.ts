import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { ObservacionIncapacidadService } from './observacion-incapacidad.service';

@Component({
    selector: 'app-observacion-incapacidad',
    templateUrl: './observacion-incapacidad.component.html',
    styleUrls: ['./observacion-incapacidad.component.scss']
})
export class ObservacionIncapacidadComponent implements OnInit {

    htmlContent:string = '';

    tipoIncapacidad: TipoIncapacidad = new TipoIncapacidad();
    subtipoIncapacidad: SubtipoIncapacidad = new SubtipoIncapacidad();

    accepted: boolean = false;
    submitted: boolean = false;

    form: FormGroup = new FormGroup({
        terminos: new FormControl(''),
    });


    constructor(private fb: FormBuilder,
        private router: Router,
        private storage: LocalStorageService,
        private observacionService: ObservacionIncapacidadService,
        private toastr:ToastrService) { }

    ngOnInit(): void {
        this.buildForm();

        this.tipoIncapacidad = this.storage.retrieve('tipoInc');
        this.subtipoIncapacidad = this.storage.retrieve('subtipoInc');

        this.getObservacionText();

    }
    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        //SET CHECK VALUE TO TABLE FIELD INCAPACIDAD
        this.router.navigate(['incapacidades/radicacion/documentacion-incapacidad']);
        window.scroll(0, 0);
    }

    buildForm() {
        this.form = this.fb.group({
            terminos: ['', Validators.required],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    getObservacionText() {
        this.observacionService.getObservacionText().subscribe(data => {
            this.htmlContent = data.descripcion;
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });
    }

    capitalizeWords(str: string): string {
        const words = str.split(/\s+/);
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }

    goPage(ruta:string) {
        window.scroll(0,0);
        this.router.navigate([ruta]);
    }

}
