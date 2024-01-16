import { Component } from '@angular/core';
import { AuthService } from 'src/app/model/auth.service';
import { SitioTrabajador } from 'src/app/model/sitio-trabajador';

@Component({
  selector: 'app-unknown-error',
  templateUrl: './unknown-error.component.html',
  styleUrls: ['./unknown-error.component.scss']
})
export class UnknownErrorComponent {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.getIsAuthenticated()) {
      window.location.href = SitioTrabajador.URL;
    }
  }
}
