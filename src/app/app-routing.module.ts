import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentosDevolucionComponent } from './pages/devolucion/documentos-devolucion/documentos-devolucion.component';
import { IncapacidadesDevueltasComponent } from './pages/devolucion/incapacidades-devueltas/incapacidades-devueltas.component';
import { ErrorAzComponent } from './pages/error/error-az/error-az.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { Error500Component } from './pages/error/error500/error500.component';
import { UnknownErrorComponent } from './pages/error/unknown-error/unknown-error.component';
import { UserNotLoggedComponent } from './pages/error/user-not-logged/user-not-logged.component';
import { DocumentacionIncapacidadComponent } from './pages/radicacion/documentacion-incapacidad/documentacion-incapacidad.component';
import { ObservacionIncapacidadComponent } from './pages/radicacion/observacion-incapacidad/observacion-incapacidad.component';
import { RadicarIncapacidadComponent } from './pages/radicacion/radicar-incapacidad/radicar-incapacidad.component';
import { TipoIncapacidadComponent } from './pages/radicacion/tipo-incapacidad/tipo-incapacidad.component';
import { SeguimientoIncapacidadesComponent } from './pages/seguimiento-incapacidades/seguimiento-incapacidades.component';
import { AppInicioComponent } from './pages/soporte/app-inicio/app-inicio.component';


const routes: Routes = [
  { path: 'app-inicio/:az-codigo/:dea-codigo/:tipo-doc/:numero-doc/:nombre-usuario/:tipo-doc-emp/:numero-doc-emp', component: AppInicioComponent },
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'incapacidades/radicacion/tipo-incapacidad', component: TipoIncapacidadComponent },
  { path: 'incapacidades/radicacion/radicar-incapacidad', component: RadicarIncapacidadComponent },
  { path: 'incapacidades/radicacion/observaciones-incapacidad', component: ObservacionIncapacidadComponent },
  { path: 'incapacidades/radicacion/documentacion-incapacidad', component: DocumentacionIncapacidadComponent },
  { path: 'incapacidades/seguimiento/historial-incapacidad', component: SeguimientoIncapacidadesComponent },
  { path: 'incapacidades/devolucion/incapacidades-devueltas', component: IncapacidadesDevueltasComponent },
  { path: 'incapacidades/devolucion/documentos-devolucion/:numeroRadicado', component: DocumentosDevolucionComponent },
  { path: 'error-az', component: ErrorAzComponent },
  { path: 'error-404', component: Error404Component },
  { path: 'error-500', component: Error500Component },
  { path: 'unknown-error', component: UnknownErrorComponent },
  { path: 'user-not-logged', component: UserNotLoggedComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'error-404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
