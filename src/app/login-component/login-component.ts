import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
  credentials = {
    email: '',
    mdp: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('userPseudo', res.user.pseudo);
        localStorage.setItem('userEmail', res.user.email);
        localStorage.setItem('userId', res.user.uid);

        alert("Ravi de te revoir, " + res.user.pseudo + " !");
        this.router.navigate(['/pokedex']); 
      },
      error: (err) => {
        alert("Email ou mot de passe incorrect !");
      }
    });
  }
}