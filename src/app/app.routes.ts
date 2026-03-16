import { Routes } from '@angular/router';
import { Error404Component } from './error-404-component/error-404-component';
import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';
import { Pokedex } from './pokedex/pokedex'

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pokedex', component: Pokedex },
  { path: '**', component: Error404Component }
];