import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Add this

@Component({
  selector: 'app-pokedex',
  standalone: true, // Ensure it's standalone if using imports
  imports: [CommonModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex implements OnInit {
  // Define this as an Observable
  pokemonList$!: Observable<any[]>; 

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    // Just assign the stream; don't subscribe here!
    this.pokemonList$ = this.pokemonService.getPokemons(0, 20);
  }
}