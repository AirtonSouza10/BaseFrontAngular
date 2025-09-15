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

  salvar(dto: FormaPagamentoDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
