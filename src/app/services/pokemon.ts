import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000/api/pokemons';

  constructor(private http: HttpClient) { }

  getPokemons(page: number = 0, limit: number = 20): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getEvolutionChain(pokedexId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evolution-chain/${pokedexId}`);
  }

  getPokemonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${id}`);
  }

  searchPokemons(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }
}