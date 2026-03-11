import { Component } from '@angular/core';
import { getPokemon } from '../../back/getAllPoké';


@Component({
  selector: 'app-pokedex',
  imports: [],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex {

  async chargerMesPokes() {
    console.log('Chargement des pokémons...');
    const data = await getPokemon();
    // Temporarily Placeholder a map for just the names of the pokemons
    const pokemons = data.map(pokemon => pokemon.name);
    console.log(pokemons);
  }
}
