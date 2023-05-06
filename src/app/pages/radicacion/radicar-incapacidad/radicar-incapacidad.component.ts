import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tooltip } from 'bootstrap';

import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Incapacidad } from 'src/app/model/incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Contrato } from 'src/app/model/contrato';
import { RequestContratosList } from 'src/app/model/request-contratos-list';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { RadicarIncapacidadService } from './radicar-incapacidad.service';
import { Enfermedad } from 'src/app/model/enfermedad';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-radicar-incapacidad',
    templateUrl: './radicar-incapacidad.component.html',
    styleUrls: ['./radicar-incapacidad.component.scss']
})
export class RadicarIncapacidadComponent implements OnInit {

    @ViewChild('contratoSelect') contratoSelect: ElementRef;
    @ViewChild('subtipoIncapacidadSelect') subtipoIncapacidadSelect: ElementRef;
    invalidClass: string = '';

    usuarioSesion: UsuarioSesion = new UsuarioSesion();

    tipoInc: TipoIncapacidad;
    tipoIncStr: string = '';

    subtiposIncapacidad: SubtipoIncapacidad[] = [];
    enfermedades: Enfermedad[] = [];

    contratos: Contrato[] = [];
    requestContrato: RequestContratosList;

    incapacidad: Incapacidad = new Incapacidad();

    contrato: Contrato = new Contrato();
    empresaPrincipal: string = '';
    empresaUsuaria: string = '';
    subtipoIncapacidad: SubtipoIncapacidad = new SubtipoIncapacidad();
    numeroIncapacidad: string = '';
    diagnostico: string = '';
    fechaInicio: string = '';
    numeroDias: number;
    prorroga: string = '';
    fechaFueroMaterno: string = '';
    fechaAccidente: string = '';

    selectedOption: any;
    searchTerm = '';

    errorMessageWarning: string = '';
    errorMessageDanger: string = '';

    submitted: boolean = false;
    form: FormGroup = new FormGroup({
        contrato: new FormControl(''),
        subtipo: new FormControl(''),
        diagnostico: new FormControl(''),
        numeroIncapacidad: new FormControl(''),
        fInicio: new FormControl(''),
        fechaFueroMaterno: new FormControl(''),
        fechaAccidente: new FormControl(''),
        numeroDias: new FormControl(''),
        prorroga: new FormControl('')
    });

    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private storage: LocalStorageService,
        private radicarService: RadicarIncapacidadService,
        private appService: AppService) {

    }

    ngOnInit(): void {
        this.invalidClass = 'col-12 custom-select';
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode));

        this.usuarioSesion = this.storage.retrieve('usuarioSesion');
        this.tipoInc = this.storage.retrieve('tipoInc');

        switch (this.tipoInc.nombreTipoIncapacidad) {
            case 'ACCIDENTE LABORAL':
                this.buildFormForEnfermedadLaboral();
                break;
            case 'ENFERMEDAD LABORAL':
                this.buildFormForEnfermedadLaboral();
                break;
            case 'LICENCIA MATERNIDAD, ABORTO Y PATERNIDAD':
                this.buildFormForLicenciaMaternidad();
                break;
            case 'ENFERMEDAD GENERAL':
                this.buildFormForEnfermedadGeneral();
                break;
            default:
                break;
        }

        this.findAllSubtipoInc();
        this.findAllContratos();
        this.findAllEnfermedades();
    }

    onSubmit() {
        this.submitted = true;

        if (this.contrato.numeroContrato == null || this.contrato.numeroContrato.toString().length === 0) {
            window.scroll(0, 0);
            this.contratoSelect.nativeElement.classList.add('is-invalid');
        }

        if (this.subtipoIncapacidad.codigoSubTipoIncapacidad == null || this.subtipoIncapacidad.nombreSubTipoIncapacidad.length === 0) {
            window.scroll(0, 0);
            this.subtipoIncapacidadSelect.nativeElement.classList.add('is-invalid');
        }



        if (this.form.invalid) {
            window.scroll(0, 0);
            this.errorMessageWarning = 'Por favor verifica que los campos esten diligenciados correctamente.';
            return;
        }
        let requestIncapacidad: RequestIncapacidad = this.storage.retrieve('requestIncapacidad');
        let enfermedad: Enfermedad = JSON.parse(JSON.stringify(this.diagnostico));

        requestIncapacidad.contrato = this.contrato.numeroContrato;
        requestIncapacidad.idGrupoEnfermedad = parseInt(enfermedad.codigoGrupoEnfermedad);
        requestIncapacidad.idCodigoEnfermedad = enfermedad.codigoEnfermedad;
        requestIncapacidad.idSubGrupoEnfermedad = parseInt(enfermedad.codigoSubtipoEnfermedad);
        requestIncapacidad.idSubTipoContigencia = this.subtipoIncapacidad.codigoSubTipoIncapacidad;
        requestIncapacidad.numeroDeDias = this.numeroDias;
        requestIncapacidad.prorroga = this.prorroga;

        this.appService.getIPAddress().subscribe((res: any) => {
            requestIncapacidad.direccionIp = res.ip;
        });

        let fechaInicioObj = new Date(this.fechaInicio);
        requestIncapacidad.fechaInicioIncapacidad = fechaInicioObj.toLocaleDateString('en-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });


        if (this.tipoInc.nombreTipoIncapacidad === 'ENFERMEDAD LABORAL' || this.tipoInc.nombreTipoIncapacidad === 'ACCIDENTE LABORAL') {
            let fechaAccidenteObj = new Date(this.fechaAccidente);
            requestIncapacidad.fechaIncidente = fechaAccidenteObj.toLocaleDateString('en-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });

        } else {
            requestIncapacidad.fechaIncidente = '';
        }

        if (this.tipoInc.nombreTipoIncapacidad === 'LICENCIA MATERNIDAD, ABORTO Y PATERNIDAD') {
            //requestIncapacidad.fechaFueroMaterno = this.fechaFueroMaterno;
        } else {
            //requestIncapacidad.fechaFueroMaterno = '';
        }

        console.log(requestIncapacidad);
        this.storage.store('requestIncapacidad', requestIncapacidad);
        this.storage.store('subtipoInc', this.subtipoIncapacidad);
        this.router.navigate(['incapacidades/radicacion/observaciones-incapacidad']);
        window.scroll(0, 0);
    }

    onChangeEnfermedad(value: any) {
        let string: string = value;
        let number: number = Number(string.split(':')[1]);
        console.log(number);
    }

    onChangeContrato(value: Contrato) {
        this.empresaPrincipal = value.nombreEmpresaPrincipal;
        this.empresaUsuaria = value.nombreEmpresaFilial;
    }

    findAllSubtipoInc() {
        this.radicarService.findAllSubtipoIncById(this.tipoInc.codigoTipoIncapacidad).subscribe(data => {
            this.subtiposIncapacidad = data;
        }, error => {
            console.error(error);
            this.toastr.error(error.error);
        });
    }

    findAllContratos() {
        this.requestContrato = new RequestContratosList(this.usuarioSesion.tipoDoc, parseInt(this.usuarioSesion.numeroDoc),
            this.usuarioSesion.tipoDocEmp, parseInt(this.usuarioSesion.numeroDocEmp));

        this.radicarService.findAllContratos(this.requestContrato).subscribe(data => {
            this.contratos = data;
        }, error => {
            console.error(error);
            this.toastr.error(error.error);
        });
    }

    findAllEnfermedades() {
        this.radicarService.findAllEnfermedades().subscribe(data => {
            this.enfermedades = data;
        }, error => {
            console.log(error);
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    buildFormForEnfermedadGeneral() {
        this.form = this.fb.group({
            contrato: ['', Validators.required],
            subtipo: ['', Validators.required],
            numeroIncapacidad: ['', [
                Validators.minLength(1),
                Validators.maxLength(20)
            ]],
            diagnostico: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            numeroDias: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(2),
                Validators.min(1),
                Validators.max(30)
            ]],
            prorroga: ['', Validators.required]
        });
    }

    buildFormForEnfermedadLaboral() {
        this.form = this.fb.group({
            contrato: ['', Validators.required],
            subtipo: ['', Validators.required],
            numeroIncapacidad: ['', [
                Validators.minLength(1),
                Validators.maxLength(20)
            ]],
            diagnostico: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            numeroDias: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(2),
                Validators.min(1),
                Validators.max(30)
            ]],
            fechaAccidente: ['', Validators.required],
            prorroga: ['', Validators.required]
        });
    }

    buildFormForLicenciaMaternidad() {
        this.form = this.fb.group({
            contrato: ['', Validators.required],
            subtipo: ['', Validators.required],
            numeroIncapacidad: ['', [
                Validators.minLength(1),
                Validators.maxLength(20)
            ]],
            diagnostico: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            numeroDias: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(3),
                Validators.min(1),
                Validators.max(300),
            ]],
            fechaFueroMaterno: ['', Validators.required],
            prorroga: ['', Validators.required]
        });
    }

    capitalizeWords(str: string): string {
        const words = str.split(/\s+/);
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }

    goPage(ruta: string) {
        window.scroll(0, 0);
        this.router.navigate([ruta]);
    }
}
