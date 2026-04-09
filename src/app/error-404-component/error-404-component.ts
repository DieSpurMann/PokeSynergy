import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-404-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule 
  ],
  templateUrl: './error-404-component.html',
  styleUrl: './error-404-component.scss',
})
export class Error404Component {

}
