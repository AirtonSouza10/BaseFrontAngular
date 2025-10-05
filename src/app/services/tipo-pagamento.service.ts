import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TipoPagamentoDTO {
  id?: number;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class TipoPagamentoService {
  private readonly apiUrl = `${environment.apiUrl}/tipo-pagamento`;

  constructor(private readonly http: HttpClient) {}

  salvar(dto: TipoPagamentoDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, dto: TipoPagamentoDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  listarTiposPagamento(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
