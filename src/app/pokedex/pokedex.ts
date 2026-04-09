import { Component, OnInit, signal, inject, computed, effect } from '@angular/core';
import { PokemonService } from '../services/pokemon';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex implements OnInit, AfterViewInit {
  pokemonList = signal<any[]>([]); 
  searchTerm = signal<string>('');
  selectedType = signal<string>(''); 

  allLoaded = false;
  page = 0;
  limit = 50; 
  isLoading = false;
  private router = inject(Router);

  pokemonTypes = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 
    'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  filteredPokemonList = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const typeFilter = this.selectedType().toLowerCase().trim(); 
    const currentList = this.pokemonList();
    
    return currentList.filter(p => {
      const matchesName = p.name.toLowerCase().includes(term);

      const matchesType = !typeFilter || (p.type && p.type.includes(typeFilter));
      
      return matchesName && matchesType;
    });
  });

  constructor(private pokemonService: PokemonService) {
    effect(() => {
      const term = this.searchTerm();
      const type = this.selectedType();
      const filtered = this.filteredPokemonList();
      
      if ((term.length > 0 || type !== '') && filtered.length === 0 && !this.allLoaded && !this.isLoading) {
        setTimeout(() => this.loadMore(), 50);
      }
    });
  }

  ngOnInit(): void {
    this.loadMore(); 
  }

  loadMore(): void {
    if (this.isLoading || this.allLoaded) return;
    this.isLoading = true;
    
    this.pokemonService.getPokemons(this.page, this.limit).subscribe({
      next: (newData) => {
        if (newData.length < this.limit) this.allLoaded = true;
        if (newData.length > 0) {
          this.pokemonList.update(current => [...current, ...newData]);
          this.page += 1;
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  @ViewChild('scrollSentinel') sentinel!: ElementRef;

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadMore();
      }
    }, { threshold: 0.1 });
    if (this.sentinel) observer.observe(this.sentinel.nativeElement);
  }

  onPokemonClick(p: any) {
    this.router.navigate(['/pokemon', p.pokedexnumber], { state: { pokemon: p } });
  }
}