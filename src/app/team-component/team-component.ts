import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

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

  // Pour supprimer un Pokémon de la liste en cliquant dessus
  retirerPokemon(index: number) {
    this.selectedPokemons.splice(index, 1);
  }
}