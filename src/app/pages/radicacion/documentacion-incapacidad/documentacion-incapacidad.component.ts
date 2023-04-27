import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { DocumentoRadicacion } from 'src/app/model/documento-radicacion';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { DocumentacionIncapacidadService } from './documentacion-incapacidad.service';

@Component({
    selector: 'app-documentacion-incapacidad',
    templateUrl: './documentacion-incapacidad.component.html',
    styleUrls: ['./documentacion-incapacidad.component.scss']
})
export class DocumentacionIncapacidadComponent implements OnInit {

    selectedFile: File;

    tipoInc: TipoIncapacidad = new TipoIncapacidad();

    documentos: DocumentoRadicacion[] = [];

    constructor(private storage: LocalStorageService,
        private documentosService: DocumentacionIncapacidadService,
        private toastr: ToastrService) { }

    ngOnInit() {
        this.getTipoIncLocalStorage();
        this.findAllDocsBySubtipoInc();
    }

    getTipoIncLocalStorage() {
        this.tipoInc = this.storage.retrieve('tipoInc');
    }

    findAllDocsBySubtipoInc() {
        this.documentosService.findAllDocsBySubtipoInc(this.tipoInc.codigoTipoIncapacidad).subscribe(data => {
            this.documentos = data;
            console.log(data);
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }


    onUpload() {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            if (result) {
                const base64 = result.toString().split(',')[1];
                console.log(base64);
                // Here you can send the "base64" variable to the server using an Angular HTTP service
            }
        };
        reader.readAsDataURL(this.selectedFile);
    }
}
