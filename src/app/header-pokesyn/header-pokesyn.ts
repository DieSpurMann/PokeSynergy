import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-pokesyn',
  imports: [CommonModule],
  templateUrl: './header-pokesyn.html',
  styleUrl: './header-pokesyn.scss',
})
export class HeaderPokesyn {
  isMenuOpen: boolean = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Le menu est ouvert ?', this.isMenuOpen);
  }
}
