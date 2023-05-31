import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentoRadicacion } from 'src/app/model/documento-radicacion';
import { RequestIncapacidad } from 'src/app/model/request-incapacidad';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class DocumentacionIncapacidadService {

    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findAllDocsBySubtipoInc(idSubtipo:number) {
        return this.http.get<DocumentoRadicacion[]>(`${this.baseUrl}/incapacidades/documentos/${idSubtipo}`);
    }

    radicarIncapacidad(reqIncapacidad:RequestIncapacidad) {
        return this.http.post<any>(`${this.baseUrl}/incapacidades/radicado/`, reqIncapacidad, { observe: 'response' });
    }
}
