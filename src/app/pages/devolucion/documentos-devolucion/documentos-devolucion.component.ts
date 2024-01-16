import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/model/auth.service';
import { DocumentoUpload } from 'src/app/model/documento-upload';
import { EstadosDocumentoCargadoEnum, EstadosDocumentoEnum, SesionDataEnum } from 'src/app/model/enums';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestCargarDocumento } from 'src/app/model/request-cargar-documento';
import { RequestDocumento } from 'src/app/model/request-documento';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';
import { DocumentosDevolucionService } from './documentos-devolucion.service';

@Component({
    selector: 'app-documentos-devolucion',
    templateUrl: './documentos-devolucion.component.html',
    styleUrls: ['./documentos-devolucion.component.scss']
})
export class DocumentosDevolucionComponent {

    numeroRadicado: string = '';
    incapacidadDevuelta: Incapacidad;
    documentos: DocumentoUpload[] = [];
    documentosRequest: RequestCargarDocumento = new RequestCargarDocumento();

    isLoadingDocumentos: boolean = false;
    isLoadingRequest: boolean = false;

    errorMessage: string = ''; 

    modalRadicacionOk:any;
    modalRadicacionError:any;
    modalRadicacionLoading:any;

    constructor(private documentoService: DocumentosDevolucionService,
        private toast: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private appService: AppService,
        private sessionStorage: SessionStorageService,
        private modalService: NgbModal,
        private authService:AuthService) { }

    ngOnInit(): void {

        if(!this.authService.getIsAuthenticated()) {
            window.location.href = SitioTrabajador.URL;
        }

        this.numeroRadicado = this.route.snapshot.params['numeroRadicado'];
        this.incapacidadDevuelta = this.sessionStorage.retrieve(SesionDataEnum.incapacidadDevuelta);

        this.getDocumentosDevolucion();
    }

    getDocumentosDevolucion() {
        this.isLoadingDocumentos = true;
        this.appService.getIPAddress().subscribe((data: any) => {
            this.documentoService.getDocumentosDevolucion(parseInt(this.numeroRadicado), data.ip).subscribe({
                next: (data: ResponseDocumentosRadicado[]) => {
                    data.forEach(dr => {
                        console.log(dr);
                        if(((dr.estadoDelDocumento === EstadosDocumentoEnum.RECHAZADO) || (dr.documentoRequerido === 'N' && dr.azCodigoCli === '0')) || (dr.azCodigoCli === '0' && dr.estadoDelDocumento === EstadosDocumentoEnum.SIN_VALIDAR)) {
                            let documentoUpload: DocumentoUpload = new DocumentoUpload();
                            documentoUpload.idDocumento = parseInt(dr.documento.idDocumento);
                            documentoUpload.descripcionDelDocumento = dr.documento.nombreDocumento;
                            documentoUpload.cargaDocumento = '';
                            documentoUpload.pesoCarga = 0;
                            documentoUpload.base64 = '';
                            documentoUpload.observaciones = dr.observaciones;
    
                            if (dr.documentoRequerido === 'N') {
                                documentoUpload.requerido = false;
                            } else {
                                documentoUpload.requerido = true;
                            }
    
                            this.documentos.push(documentoUpload);
                        }
                    });
                },
                error: (error: any) => {
                    console.log(error);
                    this.toast.error(error.message);
                    this.appService.manageHttpError(error);
                },
                complete: () => {
                    this.isLoadingDocumentos = false;
                }
            });
        });
    }

    terminarDevolucion(modalOk:any, modalLoading:any, modalError:any) {
        if (!this.validarDocumentosCargados(this.documentos)) {
            this.errorMessage = '<strong>Para radicar la incapacidad debe cargar estos documentos: </strong><br><br>' 
            + this.convertToHtmlList(this.getDocumentosFaltantes(this.documentos));
            window.scroll(0,0);
            return;
        }

        this.modalRadicacionOk = modalOk;
        this.modalRadicacionError = modalError;
        this.modalRadicacionLoading = modalLoading;

        let reqDocumentos: RequestDocumento[] = this.getRequestDocumentoFromDocumentosUpload(this.documentos);

        this.documentosRequest.numeroRadicado = this.incapacidadDevuelta.numeroRadicado;
        this.documentosRequest.estadoRadicado = 'EN CAPTURA';
        this.documentosRequest.tipoACargar = 'A';
        this.documentosRequest.documentosACargar = reqDocumentos;
        this.devolverDocumentos();
    }

    devolverDocumentos() {
        this.isLoadingRequest = true;
        this.openModalLoading(this.modalRadicacionLoading);
        this.documentoService.cargarDocumentosDevolucion(this.documentosRequest).subscribe({
            next: (response) => {
                console.log(response);
            }, 
            error: (error) => {
                console.log(error);
                this.toast.error(error.message);
                this.appService.manageHttpError(error);
                this.closeModalLoading();
                this.openModalError(this.modalRadicacionError);
            },
            complete: () => {
                this.isLoadingRequest = false;
                this.closeModalLoading();
                this.openModalOk(this.modalRadicacionOk);
                this.toast.success('Radicación Gestionada correctamente!');
                this.router.navigate(['/incapacidades/devolucion/incapacidades-devueltas']);
            }
        });
    }

    capitalizeWords(str: string) {
        return this.appService.capitalizeWords(str);
    }

    capitalizeFirstLetter(str: string) {
        if(str == null) {
            return '';
        }
        return this.appService.convertStringFirstCapitalLetter(str);
    }

    onFileSelected(event: any, documento: DocumentoUpload) {
        let file: File = new File([], "empty-file.txt", { type: "text/plain" });
        file = event.target.files[0];

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

    quitarDocumento(documento: DocumentoUpload) {
        documento.cargaDocumento = '';
        documento.pesoCarga = Number();
        documento.base64 = '';
    }

    goPage(ruta: string) {
        window.scroll(0, 0);
        this.router.navigate([ruta]);
    }

    openModalOk(modal: any) {
        this.modalRadicacionOk = this.modalService.open(modal);
    }

    openModalLoading(modal: any) {
        this.modalService.open(modal, { backdrop: 'static', centered: true});
    }

    openModalError(modal: any) {
        this.modalRadicacionError = this.modalService.open(modal);
    }

    closeModalOk() {
        this.modalRadicacionOk.close();
    }

    closeModalError() {
        this.modalRadicacionError.close();
    }

    closeModalLoading() {
        this.modalService.dismissAll();
    }

    getEstadoDocumentoCargado(documento: ResponseDocumentosRadicado): string {
        let estado: string = EstadosDocumentoCargadoEnum.no_cargado;
        if (parseInt(documento.azCodigoCli) == 0) {
            if (documento.azCodigoCli.length > 0) {
                estado = EstadosDocumentoCargadoEnum.Cargado;
            }
        }
        return estado;
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

    convertToHtmlList(str: string): string {
        let items = str.split(',');
        let listItems = items.map(item => `<li>${item.trim()}</li>`);
        return `<ul>${listItems.join('')}</ul>`;
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

    getRequestDocumentoFromDocumentosUpload(docs: DocumentoUpload[]):RequestDocumento[] {
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

    validarTamañoDocumento(file: File): boolean {
        let tamañoMaximoBytes = 10 * 1024 * 1024; // 10 MB en bytes

        if (file.size > tamañoMaximoBytes) {
            return false;
        }
        return true;
    }
}
