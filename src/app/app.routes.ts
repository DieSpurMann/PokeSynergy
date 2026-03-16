import { Routes } from '@angular/router';
import { Error404Component } from './error-404-component/error-404-component';
import { LoginComponent } from './login-component/login-component';
import { HeaderPokesyn } from './header-pokesyn/header-pokesyn';
import { Pokedex } from './pokedex/pokedex'

export const routes: Routes = [
  // Redirection par défaut (si l'utilisateur arrive sur la racine '')
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //
  { path: 'pokedex', component: Pokedex },

  // Route pour la page de connexion
  { path: 'login', component: LoginComponent },

  // LA ROUTE 404 : doit TOUJOURS être la dernière du tableau
  { path: '**', component: Error404Component }
];