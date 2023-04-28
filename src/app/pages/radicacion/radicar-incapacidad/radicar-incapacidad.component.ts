import { Component, OnInit } from '@angular/core';
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
import { SubtipoEnfermedad } from 'src/app/model/subtipo-enfermedad';

@Component({
    selector: 'app-radicar-incapacidad',
    templateUrl: './radicar-incapacidad.component.html',
    styleUrls: ['./radicar-incapacidad.component.scss']
})
export class RadicarIncapacidadComponent implements OnInit {

    usuarioSesion:UsuarioSesion = new UsuarioSesion();

    tipoInc: TipoIncapacidad;
    tipoIncStr: string = '';
    showAlertValidation: boolean = false;
    showAlertValidationContrato: boolean = false;

    subtiposIncapacidad: SubtipoIncapacidad[] = [];
    enfermedades:Enfermedad[] = [];
    subtiposEnfermedad:SubtipoEnfermedad[] = [];

    contratos:Contrato[] = [];
    requestContrato:RequestContratosList = new RequestContratosList();
    
    incapacidad: Incapacidad = new Incapacidad();
    
    contrato:Contrato = new Contrato();
    empresaPrincipal:string = '';
    empresaUsuaria:string = '';
    subtipoIncapacidad:string = '';
    numeroIncapacidad:string = '';
    diagnostico:string = '';
    fechaInicio:string = '';
    numeroDias:string ='';
    prorroga:string = '';
    fechaFueroMaterno:string = '';
    fechaAccidente:string = '';

    selectedOption: any;
    searchTerm = '';

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
        private router:Router,
        private toastr: ToastrService,
        private storage: LocalStorageService,
        private radicarService:RadicarIncapacidadService) {

    }

    ngOnInit(): void {
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
        this.showAlertValidation = false;

        if (this.form.invalid) {
            window.scroll(0, 0);
            this.showAlertValidation = true;
            return;
        }

        if(this.contrato.numeroContrato == null) {
            window.scroll(0, 0);
            this.showAlertValidationContrato = true;
            return;
        }

        this.storage.store('incapacidad', this.incapacidad);
        this.router.navigate(['incapacidades/radicacion/observaciones-incapacidad']);
        window.scroll(0, 0);
    }

    onChangeEnfermedad(value:any) {
        let string:string = value;
        let number:number = Number(string.split(':')[1]);
        console.log(number);

        //this.findAllSubtiposEnfermedad(number);
    }

    onChangeContrato(value:Contrato) {
        this.empresaPrincipal = value.nombreEmpresaPrincipal;
        this.empresaUsuaria = value.nombreEmpresaFilial;
    }

    findAllSubtipoInc() {
        this.radicarService.findAllSubtipoIncById(this.tipoInc.codigoTipoIncapacidad).subscribe(data => {
            this.subtiposIncapacidad = data;
            console.log(data);
        }, error => {
            console.error(error);
            this.toastr.error(error.error);
        });
    }

    findAllContratos() {
        this.requestContrato.tipoDocumentoEmpleado = this.usuarioSesion.tipoDoc;
        this.requestContrato.documentoEmpleado = this.usuarioSesion.numeroDoc;

        this.requestContrato.tipoDocumentoEmpresa = this.usuarioSesion.tipoDocEmp;
        this.requestContrato.documentoEmpresa = this.usuarioSesion.numeroDocEmp;
        
        this.radicarService.findAllContratos(this.requestContrato).subscribe(data => {
            this.contratos = data;
            console.log(data);
        }, error => {
            console.error(error);
            this.toastr.error(error.error);
        });
    }

    findAllEnfermedades() {
        this.radicarService.findAllEnfermedades().subscribe(data => {
            this.enfermedades = data;
            console.log(data);
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
}
