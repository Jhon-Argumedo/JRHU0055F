import { Component } from '@angular/core';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    if (!this.authService.getIsAuthenticated()) {
      window.location.href = SitioTrabajador.URL;
    }
  }
}
