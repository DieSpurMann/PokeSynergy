import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TeamService, TeamPayload } from '../services/team';

@Component({
  selector: 'app-team-component',
  standalone: true,
  // On garde CommonModule pour le HTML et DragDropModule pour le mouvement
  imports: [CommonModule, DragDropModule, FormsModule], 
  templateUrl: './team-component.html',
  styleUrl: './team-component.scss',
})
export class TeamComponent {
  // Ce tableau contiendra les objets Pokémon que tu glisses
  teamName: string = '';
  selectedPokemons: any[] = [];

  constructor(
    private teamService: TeamService
  ) {}

  // Cette fonction gère l'arrivée du Pokémon
  onDrop(event: CdkDragDrop<any[]>) {
    // On récupère la donnée transférée depuis le pokedex (le [cdkDragData])
    const pokemon = event.item.data;

    if (this.selectedPokemons.length < 6) {
      this.selectedPokemons.push(pokemon);
    } else {
      alert("Équipe pleine !");
    }
  }

  saveTeam() {
    const user = localStorage.getItem('userId');
    if (!user) return alert("Connectez-vous !");
    
    // On transforme le tableau d'objets en tableau d'IDs pour le backend
    const payload: TeamPayload = {
      user: user,
      name: this.teamName || 'Mon Équipe',
      pokemons: this.selectedPokemons.map(p => p._id) // On ne garde que les IDs
    };

    this.teamService.saveTeam(payload).subscribe({
      next: () => alert("Équipe sauvegardée avec succès !"),
      error: (err) => console.error(err)
    });
  }

  // Pour supprimer un Pokémon de la liste en cliquant dessus
  retirerPokemon(index: number) {
    this.selectedPokemons.splice(index, 1);
  }
}