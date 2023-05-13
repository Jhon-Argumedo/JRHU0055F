import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
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
    isLoading:boolean = false;

    tipoIncapacidad: TipoIncapacidad = new TipoIncapacidad();
    subtipoIncapacidad: SubtipoIncapacidad = new SubtipoIncapacidad();

    accepted: boolean = false;
    submitted: boolean = false;

    errorMessageWarning:string = '';

    form: FormGroup = new FormGroup({
        terminos: new FormControl(''),
    });


    constructor(private fb: FormBuilder,
        private router: Router,
        private storage: LocalStorageService,
        private observacionService: ObservacionIncapacidadService,
        private toastr:ToastrService,
        private appService:AppService) { }

    ngOnInit(): void {
        if(!this.appService.isUserLogged()) {
            this.toastr.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

        this.buildForm();

        this.tipoIncapacidad = this.storage.retrieve('tipoInc');
        this.subtipoIncapacidad = this.storage.retrieve('subtipoInc');

        this.getObservacionText();

    }
    
    onSubmit() {
        this.submitted = true;
        this.errorMessageWarning = '';

        if (this.form.invalid) {
            return;
        }

        if(this.isLoading) {
            this.errorMessageWarning = 'Permite que carguen las observaciones generales.';
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
        this.isLoading = true;
        this.observacionService.getObservacionText().subscribe({
            next: (data) => {
                this.htmlContent = data.descripcion;
            }, 
            error: (error) => {
                console.log(error);
                this.toastr.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
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
