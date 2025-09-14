import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AppMainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: 'main',
    component: AppMainComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
