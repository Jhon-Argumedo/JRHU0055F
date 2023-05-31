import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { SesionDataEnum } from './model/enums';
import { RequestIncapacidad } from './model/request-incapacidad';
import { TipoIncapacidad } from './model/tipo-incapacidad';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private readonly PDF_EXTENSION_REGEX = /\.pdf$/i;

    constructor(private router: Router,
        private localStorage: LocalStorageService,
        private http:HttpClient,
        private toast:ToastrService) { }

    manageHttpError(error: HttpErrorResponse) {
        if (error.status === 404) {
            this.router.navigate(['/error-404']);
        } else if (error.status === 500) {
            this.router.navigate(['/error-500']);
        } else if(error.message === 'Timeout has occurred') {
            this.router.navigate(['/unknown-error']);
        } else {
            this.router.navigate(['/unknown-error']);
        }
    }

    isUserLogged() {
        if(!this.localStorage.retrieve('usuarioSesion')) {
            return false;
        }
        return true;
    }

    getIPAddress() {
        return this.http.get('https://api.ipify.org?format=json');
    }

    goOutErrorApp() {
        this.router.navigate(['dashboard']);
    }

    isFileValid(file: File): boolean {
        return this.PDF_EXTENSION_REGEX.test(file.name);
    }

    convertStringFirstCapitalLetter(str: string): string {
        let lowercaseStr = str.toLowerCase(); 
        let capitalizedStr = lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1); // capitalize first letter
        return capitalizedStr;
    }

    capitalizeWords(str: string): string {
        const words = str.split(/\s+/);
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }

    validFlujoRadicarIncapacidad() {
        let tipoIncapacidad:TipoIncapacidad = this.localStorage.retrieve(SesionDataEnum.tipoIncapacidad);
        let requestIncapacidad:RequestIncapacidad = this.localStorage.retrieve(SesionDataEnum.requestIncapacidad);
        let checkObservacion:boolean = this.localStorage.retrieve(SesionDataEnum.checkObservacion);

        if(tipoIncapacidad == null && requestIncapacidad.contrato == 0 && !checkObservacion) {
            this.router.navigate(['/incapacidades/radicacion/tipo-incapacidad']);
        } else if(tipoIncapacidad != null && requestIncapacidad.contrato == 0 && !checkObservacion) {
            this.router.navigate(['/incapacidades/radicacion/radicar-incapacidad']);
        } else if(tipoIncapacidad != null && requestIncapacidad.contrato > 0 && !checkObservacion) {
            this.router.navigate(['/incapacidades/radicacion/observaciones-incapacidad']);
        } else if(tipoIncapacidad != null && requestIncapacidad.contrato > 0 && checkObservacion) {
            this.router.navigate(['/incapacidades/radicacion/documentacion-incapacidad']);
        }
    }
      
}
