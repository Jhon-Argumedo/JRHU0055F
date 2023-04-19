import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubtipoIncapacidad } from 'src/app/model/subtipo-incapacidad';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class SubtipoIncapacidadService {

    private baseUrl:string = environment.baseUrl + '/incapacidades/listarSubTiposIncapacidad';

    constructor(private http:HttpClient) { }

    findAllById(id:number) {
        return this.http.get<SubtipoIncapacidad[]>(`${this.baseUrl}/${id}`);
    }

}
