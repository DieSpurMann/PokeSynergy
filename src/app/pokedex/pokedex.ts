import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-pokedex',
  imports: [CommonModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex implements OnInit, AfterViewInit{
  @ViewChild('sentinel') sentinel!: ElementRef; // On cible l'élément du bas

  pokemons: any[] = [];
  page = 0;
  isLoading = false;
  hasMore = true; // Pour arrêter de chercher si la DB est vide

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // Premier chargement (Page 0)
    this.loadMore();
  }

  ngAfterViewInit(): void {
    // On surveille le sentinel
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
        this.loadMore();
      }
    }, { threshold: 0.1 }); // Se déclenche quand 10% de l'élément est visible

    observer.observe(this.sentinel.nativeElement);
  }

  loadMore() {
    this.isLoading = true;
    this.pokemonService.getPokemons(this.page).subscribe({
      next: (newData) => {
        if (newData.length < 20) this.hasMore = false; // Plus rien à charger après
        
        // On fusionne les nouveaux Pokémon avec les anciens
        this.pokemons = [...this.pokemons, ...newData];
        this.page++;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Bruh, l'API répond pas :", err);
        this.isLoading = false;
      }
    });
  }
}
