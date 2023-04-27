import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contrato } from 'src/app/model/contrato';
import { Enfermedad } from 'src/app/model/enfermedad';
import { RequestContratosList } from 'src/app/model/request-contratos-list';
import { SubtipoEnfermedad } from 'src/app/model/subtipo-enfermedad';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class RadicarIncapacidadService {

    private baseUrl: string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    findAllContratos(request:RequestContratosList) {
        return this.http.post<Contrato[]>(`${this.baseUrl}/incapacidades/ListarContratos/`, request);
    }

    findAllSubtipoIncById(id:number) {
        return this.http.get<SubtipoIncapacidad[]>(`${this.baseUrl}/incapacidades/listarSubTiposIncapacidad/${id}`);
    }

    findAllEnfermedades() {
        return this.http.get<Enfermedad[]>(`${this.baseUrl}/incapacidades/enfermedades`);
    }

}
