import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-pokesyn',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './header-pokesyn.html',
  styleUrl: './header-pokesyn.scss',
})
export class HeaderPokesyn {
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Le menu est ouvert ?', this.isMenuOpen);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userPseudo');
  }
}
