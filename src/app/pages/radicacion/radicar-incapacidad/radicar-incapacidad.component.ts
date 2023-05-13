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
import { AppService } from 'src/app/app.service';
import { RequestValidarIncapacidad } from 'src/app/model/request-validar-incapacidad';
import { ResponseValidacionIncapacidad } from 'src/app/model/response-validacion-incapacidad';
import { ContratoDTO } from 'src/app/model/contrato-dto';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

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

    currentPage: number = 1;
    pageSize: number = 10;
    totalRecords: number = 0;
    first: number = 0;

    subtiposIncapacidad: SubtipoIncapacidad[] = [];
    enfermedades: Enfermedad[] = [];

    contratos: Contrato[] = [];

    requestContrato: RequestContratosList;

    responseValidacionInc: ResponseValidacionIncapacidad = new ResponseValidacionIncapacidad();

    incapacidad: Incapacidad = new Incapacidad();

    isLoading: boolean = false;
    isLoadingValidacion:boolean = false;

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
        if(!this.appService.isUserLogged()) {
            this.toastr.info("No se ha detectado una sesion de usuario activa.");
            window.location.href = SitioTrabajador.URL;
        }

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
        this.errorMessageWarning = '';

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
        requestIncapacidad.fechaInicioIncapacidad = this.castStringDate(this.fechaInicio);

        if (this.tipoInc.nombreTipoIncapacidad === 'ENFERMEDAD LABORAL' || this.tipoInc.nombreTipoIncapacidad === 'ACCIDENTE LABORAL') {
            this.castStringDate(this.fechaAccidente);

            if (!this.validateFechaAccidente(this.fechaAccidente)) {
                window.scroll(0,0);
                this.errorMessageWarning = 'La fecha de accidente debe ser inferior o igual a la fecha de actual.';
                return;
            }
            
        } else {
            requestIncapacidad.fechaIncidente = '';
        }

        if (this.tipoInc.nombreTipoIncapacidad === 'LICENCIA MATERNIDAD, ABORTO Y PATERNIDAD') {
            requestIncapacidad.fechaFueroMaterno = this.castStringDate(this.fechaFueroMaterno);

        } else {
            requestIncapacidad.fechaFueroMaterno = '';
        }

        let contratoDTO: ContratoDTO = new ContratoDTO(this.usuarioSesion.tipoDoc, parseInt(this.usuarioSesion.numeroDoc), this.usuarioSesion.tipoDocEmp, parseInt(this.usuarioSesion.numeroDocEmp));
        let requestValidar: RequestValidarIncapacidad = new RequestValidarIncapacidad(requestIncapacidad.numeroDeDias,
            requestIncapacidad.contrato, contratoDTO, requestIncapacidad.fechaInicioIncapacidad);

        
        console.log(requestIncapacidad);
        console.log(requestValidar);
        this.isLoadingValidacion = true;
        this.radicarService.validIncapacidad(requestValidar).subscribe({
            next: (data) => {
                console.log(data);
                this.responseValidacionInc = data;
                
                if(this.responseValidacionInc.status === 'ERROR' && this.responseValidacionInc.mensaje.length > 0) {
                    this.errorMessageWarning = this.convertStringFirstCapitalLetter(this.responseValidacionInc.mensaje);
                    window.scroll(0,0);
                    return;
                }

                this.storage.store('requestIncapacidad', requestIncapacidad);
                this.storage.store('subtipoInc', this.subtipoIncapacidad);
                this.router.navigate(['incapacidades/radicacion/observaciones-incapacidad']);
                window.scroll(0, 0);
            },
            error: (error) => {
                console.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoadingValidacion = false;
                
            }
        });
    }

    findAllSubtipoInc() {
        this.isLoading = true;
        this.radicarService.findAllSubtipoIncById(this.tipoInc.codigoTipoIncapacidad).subscribe({
            next: (data) => {
                this.subtiposIncapacidad = data;
            },
            error: (error) => {
                console.error(error);
                this.toastr.error(error.error);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    findAllContratos() {
        this.isLoading = true;
        this.requestContrato = new RequestContratosList(this.usuarioSesion.tipoDoc, parseInt(this.usuarioSesion.numeroDoc),
            this.usuarioSesion.tipoDocEmp, parseInt(this.usuarioSesion.numeroDocEmp));

        this.radicarService.findAllContratos(this.requestContrato).subscribe({
            next: (data) => {
                console.log(data);
                this.contratos = data;
            },
            error: (error) => {
                console.error(error);
                this.toastr.error(error.error);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    findAllEnfermedades() {
        this.isLoading = true;
        this.radicarService.findAllEnfermedades().subscribe({
            next: (data) => {
                this.enfermedades = data;
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

    onChangeContrato(value: Contrato) {
        this.empresaPrincipal = value.nombreEmpresaPrincipal;
        this.empresaUsuaria = value.nombreEmpresaFilial;
    }

    goPage(ruta: string) {
        window.scroll(0, 0);
        this.router.navigate([ruta]);
    }

    validateFechaAccidente(fechaInicio: string): boolean {
        let inputDate = new Date(fechaInicio);
        let currentDate = new Date();

        inputDate.setDate(inputDate.getDate() + 1);
        inputDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        console.log(inputDate.getTime());
        console.log(currentDate.getTime());
        
        if(inputDate.getTime() <= currentDate.getTime()) {
            console.log('MENORR');
            return true;
        }

        return false;
    }

    castStringDate(str:string):string {
        let date:Date = new Date(str);
        let dateStr:string = '';

        date.setDate(date.getDate() + 1);

        dateStr = date.toLocaleDateString('es-CO');

        let aux:string[] = dateStr.split('/');
        dateStr = '';
        aux.forEach(s => {
            dateStr += s.padStart(2, '0') + '/';
        });
        return dateStr.slice(0, -1);;
    }

    convertStringFirstCapitalLetter(str: string): string {
        let lowercaseStr = str.toLowerCase(); 
        let capitalizedStr = lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1); // capitalize first letter
        return capitalizedStr;
    }
      

}
