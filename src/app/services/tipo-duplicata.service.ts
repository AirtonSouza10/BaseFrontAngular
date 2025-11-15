import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDuplicataService {

  private readonly baseUrl = `${environment.apiUrl}/tipo`;

  constructor(private readonly http: HttpClient) {}

  listarTipos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  criarTipo(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, dto);
  }

  atualizarTipo(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  deletarTipo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
