import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Incapacidad } from 'src/app/model/incapacidad';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class HistorialIncapacidadesService {

    private baseUrl = environment.baseUrl + '/incapacidad';

    constructor(private http: HttpClient) { }

    findAllInc() {
        return this.http.get<Incapacidad[]>(`${this.baseUrl}/`);
    }
}
