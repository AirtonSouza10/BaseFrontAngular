import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Campos que o backend espera
export interface AuthenticationDTO {
  login: string;
  senha: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(credentials: AuthenticationDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}
