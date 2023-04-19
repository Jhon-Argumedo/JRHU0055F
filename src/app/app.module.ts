import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentosDevolucionComponent } from './pages/devolucion/documentos-devolucion/documentos-devolucion.component';
import { IncapacidadesDevueltasComponent } from './pages/devolucion/incapacidades-devueltas/incapacidades-devueltas.component';
import { DocumentacionIncapacidadComponent } from './pages/radicacion/documentacion-incapacidad/documentacion-incapacidad.component';
import { ObservacionIncapacidadComponent } from './pages/radicacion/observacion-incapacidad/observacion-incapacidad.component';
import { RadicarIncapacidadComponent } from './pages/radicacion/radicar-incapacidad/radicar-incapacidad.component';
import { TipoIncapacidadComponent } from './pages/radicacion/tipo-incapacidad/tipo-incapacidad.component';
import { HistorialIncapacidadesComponent } from './pages/seguimiento/historial-incapacidades/historial-incapacidades.component';
import { GenerarGersComponent } from './pages/soporte/generar-gers/generar-gers.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ErrorComponent } from './shared/error/error.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { NotFoundPageComponent } from './pages/soporte/not-found-page/not-found-page.component';
import { AppInicioComponent } from './pages/soporte/app-inicio/app-inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DocumentosDevolucionComponent,
    IncapacidadesDevueltasComponent,
    DocumentacionIncapacidadComponent,
    ObservacionIncapacidadComponent,
    RadicarIncapacidadComponent,
    TipoIncapacidadComponent,
    HistorialIncapacidadesComponent,
    GenerarGersComponent,
    FooterComponent,
    HeaderComponent,
    ErrorComponent,
    NotFoundPageComponent,
    AppInicioComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
