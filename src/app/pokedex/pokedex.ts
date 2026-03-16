import { Component, OnInit, signal } from '@angular/core';
import { PokemonService } from '../services/pokemon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Add this
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// Inside your class:

@Component({
  selector: 'app-pokedex',
  standalone: true, // Ensure it's standalone if using imports
  imports: [CommonModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})

export class Pokedex implements OnInit, AfterViewInit {
  pokemonList = signal<any[]>([]); // Use a Signal for easy appending
  page = 0;
  limit = 30;
  isLoading = false;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadMore(); // Load the first batch
  }

  loadMore(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.pokemonService.getPokemons(this.page, this.limit).subscribe({
      next: (newData) => {
        // Append new pokemon to the existing signal array
        this.pokemonList.update(current => [...current, ...newData]);
        this.page += 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  @ViewChild('scrollSentinel') sentinel!: ElementRef;

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMore();
      }
    }, { threshold: 0.1 });

    observer.observe(this.sentinel.nativeElement);
  }
}