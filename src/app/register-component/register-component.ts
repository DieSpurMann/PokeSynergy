import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

    constructor(private router: Router) {}

    onSubmit() {
      if (this.dresseur.password !== this.dresseur.confirmPassword) {
        alert("Attention ! Les mots de passe ne sont pas identiques.");
        return;
      }

      console.log("Nouvelle inscription :", this.dresseur);
      
      alert("Bienvenue " + this.dresseur.pseudo + " ! Ton compte est créé.");
      this.router.navigate(['/login']);
    }
}
