import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamComponent } from './team-component/team-component';
import { HeaderPokesyn } from './header-pokesyn/header-pokesyn';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login-component/login-component";
import { Pokedex } from "./pokedex/pokedex";
import { Error404Component } from "./error-404-component/error-404-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TeamComponent, HeaderPokesyn, CommonModule, Pokedex, Error404Component, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pokesynergy');
}
