import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/model/auth.service';
import { DocumentoUpload } from 'src/app/model/documento-upload';
import { SesionDataEnum } from 'src/app/model/enums';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestDocumento } from 'src/app/model/request-documento';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { ResponseRadicarIncapacidad } from 'src/app/model/response-radicar-incapacidad';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { UsuarioSesion } from 'src/app/model/usuario-sesion';
import { DocumentacionIncapacidadService } from './documentacion-incapacidad.service';

@Component({
    selector: 'app-documentacion-incapacidad',
    templateUrl: './documentacion-incapacidad.component.html',
    styleUrls: ['./documentacion-incapacidad.component.scss']
})
export class DocumentacionIncapacidadComponent implements OnInit {

    tipoIncapacidad: TipoIncapacidad = new TipoIncapacidad();
    subtipoIncapacidad: SubtipoIncapacidad = new SubtipoIncapacidad();
    usuarioSesion: UsuarioSesion = new UsuarioSesion();
    requestIncapacidad: RequestIncapacidad = new RequestIncapacidad();
    incapacidad: Incapacidad = new Incapacidad();
    documentos: DocumentoUpload[] = [];
    errorMessage: string = '';
    numeroRadicado: number;
    responseRadicarIncapacidad: ResponseRadicarIncapacidad = new ResponseRadicarIncapacidad();
    isLoading: boolean = false;
    isLoadingRequest: boolean = false;

    modalRadicacionOk: any;
    modalRadicacionError: any;
    modalRadicacionLoading: any;

    constructor(private sessionStorage: SessionStorageService,
        private documentosService: DocumentacionIncapacidadService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private docService: DocumentacionIncapacidadService,
        private router: Router,
        private appService: AppService,
        private authService:AuthService) { }

    ngOnInit() {
        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }

        this.getDataSessionStorage();
        this.findAllDocsBySubtipoInc();
    }

    getDataSessionStorage() {
        this.tipoIncapacidad = this.sessionStorage.retrieve(SesionDataEnum.tipoIncapacidad);
        this.subtipoIncapacidad = this.sessionStorage.retrieve(SesionDataEnum.subtipoIncapacidad);
        this.requestIncapacidad = this.sessionStorage.retrieve(SesionDataEnum.requestIncapacidad);
        this.usuarioSesion = this.sessionStorage.retrieve(SesionDataEnum.usuarioSesion);
    }

    radicar(modalOk: any, modalLoading: any, modalError: any) {
        if (!this.validarDocumentosCargados(this.documentos)) {
            this.errorMessage = '<strong>Para radicar la incapacidad debe cargar estos documentos: </strong><br><br>'
                + this.convertToHtmlList(this.getDocumentosFaltantes(this.documentos));
            window.scroll(0, 0);
            return;
        }

        this.modalRadicacionOk = modalOk;
        this.modalRadicacionError = modalError;
        this.modalRadicacionLoading = modalLoading;

        let reqDocumentos: RequestDocumento[] = [];

        reqDocumentos = this.getRequestDocumentoFromDocumentosUpload(this.documentos);
        this.requestIncapacidad.documentosACargar = reqDocumentos;

        console.log(this.requestIncapacidad);

        this.radicarIncapacidad();
    }

    radicarIncapacidad() {
        this.isLoadingRequest = true;
        this.openModalLoading(this.modalRadicacionLoading);
        let httpResponse: HttpResponse<any>;
        this.docService.radicarIncapacidad(this.requestIncapacidad).subscribe({
            next: (response) => {
                console.log(response);
                httpResponse = response;
                this.responseRadicarIncapacidad = response.body;
                console.log(this.responseRadicarIncapacidad);
            },
            error: (error) => {
                console.log(error);
                this.closeModalLoading();
                this.openModalError(this.modalRadicacionError);
                this.toastr.error(error.message);
                this.appService.manageHttpError(error);
            },
            complete: () => {
                this.isLoadingRequest = false;
                this.closeModalLoading();
                if (httpResponse.ok && httpResponse.status === 200 && httpResponse.statusText === 'OK') {
                    this.openModalOk(this.modalRadicacionOk);
                    this.router.navigate(['incapacidades/seguimiento/historial-incapacidad']);
                    this.clearDataSessionStorage();
                } else if (httpResponse.statusText != 'OK') {
                    this.openModalError(this.modalRadicacionError);
                }
            }
        });
    }

    findAllDocsBySubtipoInc() {
        this.isLoading = true;
        this.documentos = [];
        this.documentosService.findAllDocsBySubtipoInc(this.subtipoIncapacidad.codigoSubTipoIncapacidad).subscribe({
            next: (data) => {
                data.forEach(d => {
                    let documento: DocumentoUpload = new DocumentoUpload();
                    documento.idDocumento = d.idDocumento;
                    documento.descripcionDelDocumento = d.descripcionDelDocumento;
                    documento.requerido = d.requerido;
                    documento.cargaDocumento = '';
                    documento.base64 = '';
                    documento.observacionDelDocumento = d.observacionDelDocumento;

                    this.documentos.push(documento);
                });
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

    quitarDocumento(documento: DocumentoUpload) {
        documento.cargaDocumento = '';
        documento.pesoCarga = Number();
        documento.base64 = '';
    }

    onFileSelected(event: any, documento: DocumentoUpload) {
        documento.cargaDocumento = '';
        documento.pesoCarga = Number();
        documento.base64 = '';
        
        let file: File = event.target.files[0];

        if (file.size == 0) {
            this.errorMessage = '<strong>Documento no cargado, por favor intente nuevamente. </strong>';
            window.scroll(0, 0);
            return;
        }

        if (!this.appService.isFileValid(file)) {
            this.errorMessage = '<strong>Extensión de documento no permitida, solo archivos PDF. </strong>';
            window.scroll(0, 0);
            return;
        }

        if(!this.validarTamañoDocumento(file)) {
            this.errorMessage = '<strong>Tamaño o peso de documento no permitida, máximo 10MB. </strong>';
            window.scroll(0, 0);
            return;
        }

        documento.cargaDocumento = file.name;
        documento.pesoCarga = this.bytesToMB(file.size);

        this.fileToBase64(file)
            .then((base64String) => {
                documento.base64 = base64String.split(',')[1].toString();
                console.log(documento.base64);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };

            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    bytesToMB(bytes: number): number {
        const megabytes = bytes / 1048576;
        return +megabytes.toFixed(2);
    }

    capitalizeFirstLetter(str: string) {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    openModalOk(modal: any) {
        this.modalRadicacionOk = this.modalService.open(modal, { centered: true });
    }

    openModalLoading(modal: any) {
        this.modalRadicacionLoading = this.modalService.open(modal, { backdrop: 'static', centered: true });
    }

    openModalError(modal: any) {
        this.modalRadicacionError = this.modalService.open(modal, { centered: true });
    }

    closeModalOk() {
        this.modalRadicacionOk.close();
    }

    closeModalError() {
        this.modalRadicacionError.close();
    }

    closeModalLoading() {
        this.modalRadicacionLoading.close();
    }

    validarDocumentosCargados(docs: DocumentoUpload[]) {
        let flag: boolean = true;

        docs.forEach(doc => {
            if (doc.requerido && (doc.cargaDocumento.length === 0 || doc.base64.length === 0)) {
                flag = false;
            }
        });

        return flag;
    }

    getDocumentosFaltantes(docs: DocumentoUpload[]) {
        let documentosFaltantes: string[] = [];

        docs.forEach(doc => {
            if (doc.requerido && (doc.cargaDocumento.length === 0 || doc.base64.length === 0)) {
                documentosFaltantes.push(doc.descripcionDelDocumento);
            }
        });

        return documentosFaltantes.toString();
    }

    getRequestDocumentoFromDocumentosUpload(docs: DocumentoUpload[]): RequestDocumento[] {
        let reqDocumentos: RequestDocumento[] = [];

        docs.forEach(doc => {
            let reqDocumento: RequestDocumento = new RequestDocumento();

            reqDocumento.idDocumento = doc.idDocumento;
            reqDocumento.nombreDocumento = doc.descripcionDelDocumento;
            reqDocumento.base64 = doc.base64;

            reqDocumentos.push(reqDocumento);
        });

        return reqDocumentos;
    }

    goPage(ruta: string) {
        window.scroll(0, 0);
        this.router.navigate([ruta]);
    }

    convertToHtmlList(str: string): string {
        let items = str.split(',');
        let listItems = items.map(item => `<li>${item.trim()}</li>`);
        return `<ul>${listItems.join('')}</ul>`;
    }

    capitalizeWords(str: string): string {
        const words = str.split(/\s+/);
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }

    clearDataSessionStorage() {
        this.sessionStorage.clear(SesionDataEnum.requestIncapacidad);
        this.sessionStorage.clear(SesionDataEnum.subtipoIncapacidad);
        this.sessionStorage.clear(SesionDataEnum.tipoIncapacidad);
        this.sessionStorage.clear(SesionDataEnum.checkObservacion);
    }

    validarTamañoDocumento(file: File): boolean {
        let tamañoMaximoBytes = 10 * 1024 * 1024; // 10 MB en bytes

        if (file.size > tamañoMaximoBytes) {
            return false;
        }
        return true;
    }

}
