// app/pokepage/pokepage.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../services/pokemon';
import { CommonModule } from '@angular/common';
import { TypeLogoPipe } from '../pipes/type-logo-pipe';

@Component({
  selector: 'app-pokepage',
  standalone: true,
  imports: [CommonModule, TypeLogoPipe],
  templateUrl: './pokepage.html',
  styleUrl: './pokepage.scss'
})

export class Pokepage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pokemonService = inject(PokemonService);

  pokemon = signal<any>(null);
  evolutionChain = signal<any[]>([]);

  ngOnInit() {
    // 1. Récupérer l'ID de l'URL
    const id: string = this.route.snapshot.paramMap.get('id') || '';
    
    if (id) {
      // 2. Charger le Pokémon principal
      this.pokemonService.getPokemonById(+id).subscribe(data => {
        this.pokemon.set(data);
        
        // 3. Charger sa famille (en utilisant la logique de pré-évo 'family')
        this.loadEvolutionChain(+id);
      });
    }
  }

  loadEvolutionChain(id: number) {
    this.pokemonService.getEvolutionChain(id).subscribe(chain => {
      this.evolutionChain.set(chain);
    });
  }

  onEvolutionClick(evo: any) {
    this.router.navigate(['/pokemon', evo.pokedexnumber]);
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);}
}