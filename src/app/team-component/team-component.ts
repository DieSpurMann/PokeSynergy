import { Component, OnInit } from '@angular/core';
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
export class TeamComponent implements OnInit {
  // Ce tableau contiendra les objets Pokémon que tu glisses
  teamName: string = '';
  selectedPokemons: any[] = [];
  myTeams: any[] = [];

  constructor(
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.loadUserTeams();
  }

  loadUserTeams() {
    const user = localStorage.getItem('userId');
    if (user) {
      this.teamService.getTeamsByUser(user).subscribe(teams => {
        this.myTeams = teams;
      });
    }
  }

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
  // src/app/team-component/team-component.ts
  onTeamSelected(event: any) {
      const teamId = event.target.value;
      
      if (!teamId) {
          // Reset pour une nouvelle équipe
          this.selectedPokemons = [];
          this.teamName = '';
          return;
      }
    
      // On cherche l'équipe dans notre liste locale chargée au ngOnInit
      const team = this.myTeams.find(t => t._id === teamId);
      
      if (team) {
          this.teamName = team.name;
          // Comme on a fait .populate() sur le back, team.pokemons est déjà une liste d'objets !
          this.selectedPokemons = [...team.pokemons]; 
      }
  }

  // Pour supprimer un Pokémon de la liste en cliquant dessus
  retirerPokemon(index: number) {
    this.selectedPokemons.splice(index, 1);
  }

  // Cette fonction permet de cliquer sur une équipe existante 
  // pour la remettre dans l'éditeur de drag-and-drop
  editTeam(team: any) {
    this.teamName = team.name;
    // Si ton backend a fait un .populate('pokemons'), tu auras les objets complets
    this.selectedPokemons = [...team.pokemons]; 
    console.log(team);
  }
}