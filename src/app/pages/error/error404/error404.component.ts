import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss']
})
export class Error404Component  {
    
    goBack(): void {
        window.history.back();
    }
}
