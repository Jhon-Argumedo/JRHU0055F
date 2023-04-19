import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tooltip } from 'bootstrap';

import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Incapacidad } from 'src/app/model/incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { SubtipoIncapacidadService } from './subtipo-incapacidad.service';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-radicar-incapacidad',
    templateUrl: './radicar-incapacidad.component.html',
    styleUrls: ['./radicar-incapacidad.component.scss']
})
export class RadicarIncapacidadComponent implements OnInit {

    tipoInc: TipoIncapacidad;
    tipoIncStr: string = '';
    showAlertValidation: boolean = false;

    subtipos: SubtipoIncapacidad[] = [];

    incapacidad: Incapacidad = new Incapacidad();
    submitted: boolean = false;
    form: FormGroup = new FormGroup({
        contrato: new FormControl(''),
        subtipo: new FormControl(''),
        codDiag: new FormControl(''),
        fInicio: new FormControl(''),
        noDias: new FormControl(''),
        prorroga: new FormControl('')
    });

    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private subtipoIncService: SubtipoIncapacidadService,
        private toastr: ToastrService,
        private storage: LocalStorageService) {

    }

    buildForm() {
        this.form = this.fb.group({
            contrato: ['', Validators.required],
            subtipo: ['', Validators.required],
            codDiag: ['', Validators.required],
            fInicio: ['', Validators.required],
            noDias: ['', Validators.required],
            prorroga: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.buildForm();
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode));

        this.tipoInc = this.storage.retrieve('tipoInc');

        this.findAllSubtipoInc();
    }

    onSubmit() {
        this.submitted = true;
        this.showAlertValidation = false;

        if (this.form.invalid) {
            window.scroll(0, 0);
            this.showAlertValidation = true;
            return;
        }
    }

    findAllSubtipoInc() {
        this.subtipoIncService.findAllById(this.tipoInc.codigoTipoIncapacidad).subscribe(data => {
            this.subtipos = data;
            console.log(data);
        }, error => {
            console.error(error);
            this.toastr.error(error.error);
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }
}
