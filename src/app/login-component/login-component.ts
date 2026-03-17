import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import indispensable pour [(ngModel)]
import { AuthService } from '../services/auth.service'; // Ajuste le chemin selon ton dossier

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  // L'objet qui va stocker les données saisies dans le HTML
  credentials = {
    email: '',
    mdp: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogin() {
    // On envoie les identifiants au service
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        // Succès : res contient le message et les infos du dresseur
        alert("Ravi de te revoir, " + res.user.pseudo + " !");
        
        // Redirection vers le pokedex (ou ta page d'accueil)
        this.router.navigate(['/pokedex']); 
      },
      error: (err) => {
        // Erreur : on affiche le message d'erreur renvoyé par le serveur
        console.error("Erreur de connexion", err);
        alert("Email ou mot de passe incorrect, dresseur !");
      }
    });
  }
}