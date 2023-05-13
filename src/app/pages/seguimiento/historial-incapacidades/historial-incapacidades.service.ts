import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { Incapacidad } from 'src/app/model/incapacidad';
import { RequestIncapacidadesUsuario } from 'src/app/model/request-incapacidades-usuario';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class HistorialIncapacidadesService {

    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    findAllInc(reqIncUsuario:RequestIncapacidadesUsuario) {
        return this.http.post<Incapacidad[]>(`${this.baseUrl}/incapacidades/listarIncapacidades`, reqIncUsuario).pipe(timeout(50000));;
    }
}
