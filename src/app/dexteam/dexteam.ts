import { Component } from '@angular/core';
import { Pokedex } from "../pokedex/pokedex";
import { TeamComponent } from "../team-component/team-component";

@Component({
  selector: 'app-dexteam',
  imports: [Pokedex, TeamComponent],
  templateUrl: './dexteam.html',
  styleUrl: './dexteam.scss',
})
export class Dexteam {

}
