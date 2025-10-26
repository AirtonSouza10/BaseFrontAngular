import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Campos que o backend espera
export interface AuthenticationDTO {
  login: string;
  senha: string;
}

export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  login: string;
  senha: string;
  identificacao: string;
  telefone: string;
  ativo: boolean;
}

export interface AlterarSenhaDTO {
  senhaAntiga: string;
  senhaNova: string;
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

  registrar(usuario: UsuarioDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/registro`, usuario);
  }

  atualizarStatusUsuario(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}/status`, ativo);
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/usuarios`);
  }

  alterarSenha(id: number, dto: AlterarSenhaDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}/senha`, dto);
  }

  atualizarUsuario(id: number, dto: UsuarioDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}`, dto);
  }
}
