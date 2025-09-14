import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppMainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { TipoNotaComponent } from './components/tipo-nota/tipo-nota.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: AppMainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tipo-nota',
        component: TipoNotaComponent
      }
    ]
  }
];
