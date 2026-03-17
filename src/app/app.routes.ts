import { Routes } from '@angular/router';
import { Error404Component } from './error-404-component/error-404-component';
import { LoginComponent } from './login-component/login-component';
import { RegisterComponent } from './register-component/register-component';
import { Pokedex } from './pokedex/pokedex'
import { TeamComponent } from './team-component/team-component';
import { Dexteam } from './dexteam/dexteam';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'pokedex', component: Dexteam },
  { path: '**', component: Error404Component }
];