import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FormaPagamentoDTO {
  id?: number;
  descricao: string;
  qtdeParcelas: number;
}

@Injectable({ providedIn: 'root' })
export class FormaPagamentoService {
  private readonly apiUrl = `${environment.apiUrl}/forma-pagamento`;

  constructor(private readonly http: HttpClient) {}

  /** Cria ou atualiza uma forma de pagamento */
  salvar(dto: FormaPagamentoDTO): Observable<any> {
    if (dto.id) {
      // Atualiza
      return this.http.put(`${this.apiUrl}/${dto.id}`, dto);
    }
    // Cria novo
    return this.http.post(this.apiUrl, dto);
  }

  /** Lista todas as formas de pagamento */
  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Busca forma de pagamento por ID */
  buscarPorId(id: number): Observable<FormaPagamentoDTO> {
    return this.http.get<FormaPagamentoDTO>(`${this.apiUrl}/${id}`);
  }

  /** Exclui forma de pagamento por ID */
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
