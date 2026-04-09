import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamPayload {
  user: string;
  name: string;
  pokemons: any[]; // Un simple tableau d'IDs
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/api/teams';

  constructor(private http: HttpClient) { }

  saveTeam(teamData: TeamPayload): Observable<any> {
    return this.http.post(this.apiUrl+'/save', teamData);
  }

  getTeamsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}