import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCargarDocumento } from 'src/app/model/request-cargar-documento';
import { ResponseDocumentosRadicado } from 'src/app/model/response-documentos-radicado';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class DocumentosDevolucionService {

    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    getDocumentosDevolucion(numeroRadicado:number, userIp:string) {
        return this.http.get<ResponseDocumentosRadicado[]>(`${this.baseUrl}/incapacidades/listarDocumentosPorRadicado/${numeroRadicado}/${userIp}`);
    }

    cargarDocumentosDevolucion(request:RequestCargarDocumento) {
        return this.http.post<any>(`${this.baseUrl}/incapacidades/cargarArchivo/`, request);
    }   
}
