import { Component } from '@angular/core';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
  selector: 'app-generar-gers',
  templateUrl: './generar-gers.component.html',
  styleUrls: ['./generar-gers.component.scss']
})
export class GenerarGersComponent {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    if (!this.authService.getIsAuthenticated()) {
      window.location.href = SitioTrabajador.URL;
    }
  }
}
