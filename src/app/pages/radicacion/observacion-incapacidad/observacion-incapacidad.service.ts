import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseObservaciones } from 'src/app/model/response-observaciones';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ObservacionIncapacidadService {

    private baseUrl:string = environment.baseUrl;

    constructor(private http:HttpClient) { }

    getObservacionText() {
        return this.http.get<ResponseObservaciones>(`${this.baseUrl}/incapacidades/terminos`);
    }
}
