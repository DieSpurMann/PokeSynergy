import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  dresseur: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const pseudo = localStorage.getItem('userPseudo');
    const email = localStorage.getItem('userEmail');

    if (pseudo && email) {
      this.dresseur = { pseudo, email };
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}