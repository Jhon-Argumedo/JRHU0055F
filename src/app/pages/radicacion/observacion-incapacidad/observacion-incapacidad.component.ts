import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-observacion-incapacidad',
  templateUrl: './observacion-incapacidad.component.html',
  styleUrls: ['./observacion-incapacidad.component.scss']
})
export class ObservacionIncapacidadComponent implements OnInit {

    accepted:boolean = false;
    submitted:boolean = false;

    form: FormGroup = new FormGroup({
        terminos: new FormControl(''),
    });

    ngOnInit(): void {
        this.buildForm();
    }

    constructor(private fb: FormBuilder,
        private router:Router) {}

    onSubmit() {
        this.submitted = true;

        if(this.form.invalid) {
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

}
