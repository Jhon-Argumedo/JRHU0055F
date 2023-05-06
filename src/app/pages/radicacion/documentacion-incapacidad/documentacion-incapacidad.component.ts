import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Tooltip } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { DocumentoUpload } from 'src/app/model/documento-upload';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestDocumento } from 'src/app/model/request-documento';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { ResponseRadicarIncapacidad } from 'src/app/model/response-radicar-incapacidad';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { DocumentacionIncapacidadService } from './documentacion-incapacidad.service';

@Component({
    selector: 'app-documentacion-incapacidad',
    templateUrl: './documentacion-incapacidad.component.html',
    styleUrls: ['./documentacion-incapacidad.component.scss']
})
export class DocumentacionIncapacidadComponent implements OnInit {

    tipoIncapacidad: TipoIncapacidad = new TipoIncapacidad();
    subtipoIncapacidad: SubtipoIncapacidad = new SubtipoIncapacidad();
    incapacidad: Incapacidad = new Incapacidad();
    documentos: DocumentoUpload[] = [];
    modalRadicacion: NgbModalRef;
    errorMessage: string = '';
    numeroRadicado:number;
    responseRadicarIncapacidad:ResponseRadicarIncapacidad = new ResponseRadicarIncapacidad();

    constructor(private storage: LocalStorageService,
        private documentosService: DocumentacionIncapacidadService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private docService: DocumentacionIncapacidadService,
        private router: Router) { }

    ngOnInit() {
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode));

        this.getDataLocalStorage();
        this.findAllDocsBySubtipoInc();
    }

    getDataLocalStorage() {
        this.tipoIncapacidad = this.storage.retrieve('tipoInc');
        this.subtipoIncapacidad = this.storage.retrieve('subtipoInc');
    }

    radicar(content: any) {
        let reqDocumentos: RequestDocumento[] = [];

        if (!this.validarDocumentosCargados(this.documentos)) {
            this.toastr.error('No se puede realizar la radicación, faltan documentos por cargar.');
            this.errorMessage = '<strong>Para radicar la incapacidad debe cargar estos documentos: </strong><br><br>' 
            + this.convertToHtmlList(this.getDocumentosFaltantes(this.documentos));
            window.scroll(0,0);
            return;
        }

        let requestIncapacidad:RequestIncapacidad = this.storage .retrieve('requestIncapacidad');
        
        reqDocumentos = this.getRequestDocumentoFromDocumentosUpload(this.documentos);

        requestIncapacidad.documentosACargar = reqDocumentos;
        console.log(requestIncapacidad);

        this.docService.radicarIncapacidad(requestIncapacidad).subscribe(data => {
            this.openModal(content);
            console.log(data);
            this.responseRadicarIncapacidad = data;
            this.router.navigate(['incapacidades/seguimiento/historial-incapacidad']);
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });

    }

    findAllDocsBySubtipoInc() {
        this.documentosService.findAllDocsBySubtipoInc(this.tipoIncapacidad.codigoTipoIncapacidad).subscribe(data => {
            data.forEach(d => {
                let documento: DocumentoUpload = new DocumentoUpload();
                documento.idDocumento = d.idDocumento;
                documento.descripcionDelDocumento = d.descripcionDelDocumento;
                documento.requerido = d.requerido;
                documento.cargaDocumento = '';
                documento.base64 = '';

                this.documentos.push(documento);
            });
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });
    }

    quitarDocumento(documento: DocumentoUpload) {
        documento.cargaDocumento = '';
        documento.pesoCarga = Number();
        documento.base64 = '';
    }

    onFileSelected(event: any, documento: DocumentoUpload) {
        let file: File = event.target.files[0];

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

    openModal(modal: any) {
        this.modalRadicacion = this.modalService.open(modal);
    }

    closeModal() {
        this.modalRadicacion.close();
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

}
