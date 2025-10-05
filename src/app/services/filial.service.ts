import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FilialDTO {
  id?: number;
  nome: string;
  identificacao: string;
  email: string;
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FilialService {
  private readonly apiUrl = `${environment.apiUrl}/filial`;

  constructor(private http: HttpClient) {}

  listarFiliais(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  salvarFilial(dto: FilialDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  atualizarFilial(id: number, dto: FilialDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  atualizarStatusFilial(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, ativo);
  }
}
