import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Campos que o backend espera
export interface AuthenticationDTO {
  login: string;
  senha: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(credentials: AuthenticationDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}
