import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(private router: Router,
        private localStorage: LocalStorageService,
        private http:HttpClient) { }

    manageError(error: HttpErrorResponse) {
        if (error.status === 404) {
            this.localStorage.store('displayError', '404');
            this.router.navigate(['/error-404']);
        } else if (error.status === 500) {
            this.localStorage.store('displayError', '500');
            this.router.navigate(['/error-500']);

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
      
}
