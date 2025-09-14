import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppMainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard'; // <-- importar o guard

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: 'main',
    component: AppMainComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
