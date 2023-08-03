import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { Incapacidad } from 'src/app/model/incapacidad';
import { Observacion } from 'src/app/model/observacion';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class SeguimientoIncapacidadesService {

    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    findAllIncacidades(reqIncUsuario:RequestIncapacidadesUsuario) {
        return this.http.post<Incapacidad[]>(`${this.baseUrl}/incapacidades/listarIncapacidades`, reqIncUsuario);;
    }

    findObservacionesByNumeroRadicado(radicado:number) {
        return this.http.get<Observacion[]>(`${this.baseUrl}/incapacidades/listarObservacionPorRadicado/${radicado}`);
    }
}
