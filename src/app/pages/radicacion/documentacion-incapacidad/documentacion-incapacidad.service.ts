import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentoRadicacion } from 'src/app/model/documento-radicacion';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class DocumentacionIncapacidadService {

    private baseUrl:string = environment.baseUrl + '/incapacidades/documentos';

    constructor(private http:HttpClient) { }

    findAllDocsBySubtipoInc(idSubtipo:number) {
        return this.http.get<DocumentoRadicacion[]>(`${this.baseUrl}/${idSubtipo}`);
    }
}
