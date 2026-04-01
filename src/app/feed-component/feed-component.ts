import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-component.html',
  styleUrls: ['./feed-component.scss']
})
export class FeedComponent implements OnInit {
  teams: any[] = [];
  page: number = 0;
  limit: number = 8; // On augmente un peu pour remplir l'écran plus vite
  loading: boolean = false;
  allLoaded: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    if (this.loading || this.allLoaded) return;
    
    this.loading = true;
    const url = `http://localhost:3000/api/teams?page=${this.page}&limit=${this.limit}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (data.length < this.limit) {
          this.allLoaded = true;
        }

        if (data.length > 0) {
          this.teams = [...this.teams, ...data];
          this.page++;

          // Vérification magique : si l'écran n'est pas encore plein, on charge la suite
          setTimeout(() => {
            this.checkIfNeedsMore();
          }, 150);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur :", err);
        this.loading = false;
      }
    });
  }

  // Cette fonction force le chargement si la page est trop courte pour scroller
  checkIfNeedsMore(): void {
    const windowHeight = window.innerHeight;
    const contentHeight = document.documentElement.scrollHeight;

    if (windowHeight >= contentHeight && !this.allLoaded && !this.loading) {
      this.loadTeams();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;
    
    // On charge quand on arrive à 200px du bas
    if (pos >= max - 200 && !this.loading) {
      this.loadTeams();
    }
  }
}