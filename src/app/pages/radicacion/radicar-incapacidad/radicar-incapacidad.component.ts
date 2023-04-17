import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tooltip } from 'bootstrap';

import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Incapacidad } from 'src/app/model/incapacidad';

@Component({
    selector: 'app-radicar-incapacidad',
    templateUrl: './radicar-incapacidad.component.html',
    styleUrls: ['./radicar-incapacidad.component.scss']
})
export class RadicarIncapacidadComponent implements OnInit {

    tipoInc: string = '';
    showAlertValidation:Boolean = false;

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

    constructor(private route: ActivatedRoute, private fb: FormBuilder) {

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
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]'))
            .forEach(tooltipNode => new Tooltip(tooltipNode));

        this.tipoInc = this.route.snapshot.params['tipo-inc'];
        this.tipoInc = this.tipoInc.replace('_', ' ');
    }

    onSubmit() {
        this.submitted = true;
        this.showAlertValidation = false;

        if (this.form.invalid) {
            window.scroll(0,0);
            this.showAlertValidation = true;
            return;
        }


    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }
}
