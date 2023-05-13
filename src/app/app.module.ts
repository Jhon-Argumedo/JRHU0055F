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
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppInicioComponent } from './pages/soporte/app-inicio/app-inicio.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { UnknownErrorComponent } from './pages/error/unknown-error/unknown-error.component';
import { Location } from '@angular/common';
import { UserNotLoggedComponent } from './pages/error/user-not-logged/user-not-logged.component';
import { TableModule } from 'primeng/table';
import { ErrorAzComponent } from './pages/error/error-az/error-az.component';


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
    AppInicioComponent,
    Error404Component,
    Error500Component,
    UnknownErrorComponent,
    UserNotLoggedComponent,
    ErrorAzComponent
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
    DropdownModule,
    ButtonModule,
    NgbModule,
    TableModule
  ],
  providers: [Location],
  bootstrap: [AppComponent]
})
export class AppModule { }