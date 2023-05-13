import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private readonly PDF_EXTENSION_REGEX = /\.pdf$/i;

    constructor(private router: Router,
        private localStorage: LocalStorageService,
        private http:HttpClient) { }

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
      
}
