import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SituacaoDTO {
  id?: number;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class SituacaoService {
  private readonly apiUrl = `${environment.apiUrl}/status-conta`;

  constructor(private readonly http: HttpClient) {}

  salvar(dto: SituacaoDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  listarSituacoes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
