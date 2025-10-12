import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ParcelaDTO {
  id?: number;
  valorTotal: number;
  dtVencimento: string | Date;
}

export interface DuplicataDTO {
  id?: number;
  descricao: string;
  valor: number;
  desconto?: number;
  multa?: number;
  juros?: number;
  valorTotal: number;
  dtCriacao?: string | Date;
  dtAtualizacao?: string | Date;
  formaPagamentoId: number;
  parcelas?: ParcelaDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DuplicataService {
  private readonly apiUrl = `${environment.apiUrl}/duplicata`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  salvar(dto: DuplicataDTO): Observable<DuplicataDTO> {
    return this.http.post<DuplicataDTO>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: DuplicataDTO): Observable<DuplicataDTO> {
    return this.http.put<DuplicataDTO>(`${this.apiUrl}/${id}`, dto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
