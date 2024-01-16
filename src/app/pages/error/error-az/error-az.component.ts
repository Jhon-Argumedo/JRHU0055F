import { Component } from '@angular/core';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
  selector: 'app-error-az',
  templateUrl: './error-az.component.html',
  styleUrls: ['./error-az.component.scss']
})
export class ErrorAzComponent {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    if (!this.authService.getIsAuthenticated()) {
      window.location.href = SitioTrabajador.URL;
    }
  }
}
