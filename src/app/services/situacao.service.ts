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

  /** Cria ou atualiza uma situação */
  salvar(dto: SituacaoDTO): Observable<any> {
    if (dto.id) {
      // Atualiza
      return this.http.put(`${this.apiUrl}/${dto.id}`, dto);
    }
    // Cria novo
    return this.http.post(this.apiUrl, dto);
  }

  /** Lista todas as situações */
  listarSituacoes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Busca situação por ID */
  buscarPorId(id: number): Observable<SituacaoDTO> {
    return this.http.get<SituacaoDTO>(`${this.apiUrl}/${id}`);
  }

  /** Exclui situação por ID */
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
