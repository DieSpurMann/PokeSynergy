import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  dresseur = {
      pseudo: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.dresseur.password !== this.dresseur.confirmPassword) {
      alert("Attention ! Les mots de passe ne sont pas identiques.");
      return;
    }

    const data = {
      pseudo: this.dresseur.pseudo,
      email: this.dresseur.email,
      mdp: this.dresseur.password
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        alert("Bienvenue " + this.dresseur.pseudo + " ! Ton compte est enregistré.");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Erreur API :", err);
        alert("Erreur lors de l'enregistrement en base de données.");
      }
    });
  }
}
