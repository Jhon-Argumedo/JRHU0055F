import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoIncapacidad } from 'src/app/model/tipo-incapacidad';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class TipoIncapacidadService {

    private baseUrl: string = environment.baseUrl + '/incapacidades/listarTiposIncapacidad';

    constructor(private http: HttpClient) { }

    findAll() {
        return this.http.get<TipoIncapacidad[]>(`${this.baseUrl}`);
    }
}
