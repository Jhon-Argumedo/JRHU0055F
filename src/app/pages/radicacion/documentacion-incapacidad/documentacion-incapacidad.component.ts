import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Tooltip } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { DocumentoUpload } from 'src/app/model/documento-upload';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestDocumento } from 'src/app/model/request-documento';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { DocumentacionIncapacidadService } from './documentacion-incapacidad.service';

@Component({
    selector: 'app-documentacion-incapacidad',
    templateUrl: './documentacion-incapacidad.component.html',
    styleUrls: ['./documentacion-incapacidad.component.scss']
})
export class DocumentacionIncapacidadComponent implements OnInit {

    requestIncapacidad:RequestIncapacidad = new RequestIncapacidad();
    incapacidad:Incapacidad = new Incapacidad();
    tipoInc: TipoIncapacidad = new TipoIncapacidad();
    documentos: DocumentoUpload[] = [];
    modalRadicacion:NgbModalRef;
    numeroRadicado:string = '';

    constructor(private storage: LocalStorageService,
        private documentosService: DocumentacionIncapacidadService,
        private toastr: ToastrService,
        private modalService:NgbModal,
        private docService:DocumentacionIncapacidadService) { }

    ngOnInit() {
        Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"], i[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode));
        this.getTipoIncLocalStorage();
        this.findAllDocsBySubtipoInc();
    }

    getTipoIncLocalStorage() {
        this.tipoInc = this.storage.retrieve('tipoInc');
    }

    radicar(content:any) {
        let reqDocumentos:RequestDocumento[] = [];
        console.log(this.documentos);
        console.log(content);

        if(!this.validarDocumentosCargados(this.documentos)) {
            return;
        }
        reqDocumentos = this.getRequestDocumentoFromDocumentosUpload(this.documentos);
        this.requestIncapacidad = this.buildRequestIncapacidadObject(this.incapacidad, reqDocumentos);

        this.docService.radicarIncapacidad(this.requestIncapacidad).subscribe(data => {
            this.openModal(content);
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });

    }

    findAllDocsBySubtipoInc() {
        this.documentosService.findAllDocsBySubtipoInc(this.tipoInc.codigoTipoIncapacidad).subscribe(data => {
            data.forEach(d => {
                let documento: DocumentoUpload = new DocumentoUpload();
                documento.idDocumento = d.idDocumento;
                documento.descripcionDelDocumento = d.descripcionDelDocumento;
                documento.requerido = d.requerido;

                this.documentos.push(documento);
            });
            console.log(data);
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });
    }

    quitarDocumento(documento:DocumentoUpload) {
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
                documento.base64 = base64String;
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

    capitalizeFirstLetter(str:string) {
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    openModal(modal:any) {
        this.modalRadicacion = this.modalService.open(modal);
    }

    closeModal() {
        this.modalRadicacion.close();
    }

    validarDocumentosCargados(docs:DocumentoUpload[]) {
        let flag:boolean = true;
        docs.forEach(doc => {
            if(doc.requerido && (doc.cargaDocumento === '' || doc.base64 === '')) {
                flag = false;
            }
        });

        return flag;
    }

    getRequestDocumentoFromDocumentosUpload(docs:DocumentoUpload[]) {
        let reqDocumentos:RequestDocumento[] = [];

        docs.forEach(doc => {
            let reqDocumento:RequestDocumento = new RequestDocumento();

            reqDocumento.idDocumento = doc.idDocumento;
            reqDocumento.base64 = doc.base64;
    
            reqDocumentos.push(reqDocumento);
        });

        return reqDocumentos;
    }

    buildRequestIncapacidadObject(incapacidad:Incapacidad, documentos:RequestDocumento[]) {
        let reqIncapacidad:RequestIncapacidad = new RequestIncapacidad();

        reqIncapacidad.documentos = documentos;

        return reqIncapacidad;
    }

}
