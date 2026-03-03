import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamComponent } from './team-component/team-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TeamComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pokesynergy');
}
