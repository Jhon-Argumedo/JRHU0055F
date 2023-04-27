import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentosDevolucionComponent } from './pages/devolucion/documentos-devolucion/documentos-devolucion.component';
import { IncapacidadesDevueltasComponent } from './pages/devolucion/incapacidades-devueltas/incapacidades-devueltas.component';
import { DocumentacionIncapacidadComponent } from './pages/radicacion/documentacion-incapacidad/documentacion-incapacidad.component';
import { ObservacionIncapacidadComponent } from './pages/radicacion/observacion-incapacidad/observacion-incapacidad.component';
import { RadicarIncapacidadComponent } from './pages/radicacion/radicar-incapacidad/radicar-incapacidad.component';
import { TipoIncapacidadComponent } from './pages/radicacion/tipo-incapacidad/tipo-incapacidad.component';
import { HistorialIncapacidadesComponent } from './pages/seguimiento/historial-incapacidades/historial-incapacidades.component';
import { AppInicioComponent } from './pages/soporte/app-inicio/app-inicio.component';
import { NotFoundPageComponent } from './pages/soporte/not-found-page/not-found-page.component';
import { ErrorComponent } from './shared/error/error.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'app-inicio/:az-codigo/:dea-codigo/:tipo-doc/:numero-doc/:nombre-usuario/:tipo-doc-emp/:numero-doc-emp', component: AppInicioComponent },
  { path: 'incapacidades/radicacion/radicar-incapacidad', component: RadicarIncapacidadComponent },
  { path: 'incapacidades/radicacion/tipo-incapacidad', component: TipoIncapacidadComponent },
  { path: 'incapacidades/radicacion/observaciones-incapacidad', component: ObservacionIncapacidadComponent },
  { path: 'incapacidades/radicacion/documentacion-incapacidad', component: DocumentacionIncapacidadComponent },
  { path: 'incapacidades/seguimiento/historial-incapacidad', component: HistorialIncapacidadesComponent },
  { path: 'incapacidades/devolucion/incapacidades-devueltas', component: IncapacidadesDevueltasComponent },
  { path: 'incapacidades/devolucion/documentos-devolucion', component: DocumentosDevolucionComponent },
  { path: 'incapacidades/error', component: ErrorComponent },
  { path: 'incapacidades/error/not-page-found', component: NotFoundPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
