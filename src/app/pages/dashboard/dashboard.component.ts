import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    valid:boolean = true;

    constructor(private router: Router,
        private storage: LocalStorageService) { }

    ngOnInit(): void {
        if(!this.valid) {
            this.router.navigate(['error']);
        }
        this.storage.store('username', 'John');
        console.log(this.storage.retrieve('username'));
    }

    go(route: string) {
        this.router.navigate([route]);
        window.scroll(0, 0);
    }
}
