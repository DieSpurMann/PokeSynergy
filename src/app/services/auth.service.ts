import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Vérifie ton PORT dans utils.conf

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}

