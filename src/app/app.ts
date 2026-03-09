import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamComponent } from './team-component/team-component';
import { HeaderPokesyn } from './header-pokesyn/header-pokesyn';
import { CommonModule } from '@angular/common';
import { Pokedex } from "./pokedex/pokedex";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TeamComponent, HeaderPokesyn, CommonModule, Pokedex],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pokesynergy');
}
