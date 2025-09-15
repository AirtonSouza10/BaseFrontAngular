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

  listarTiposPagamento(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
