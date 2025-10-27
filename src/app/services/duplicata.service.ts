import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotaFiscalDTO } from './nota-fiscal.service';

export interface ParcelaDTO {
  id?: number;
  numeroParcela?: string;
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
  notasFiscais?: NotaFiscalDTO[];
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

  // ================= NOVOS ENDPOINTS PAGINADOS =================

  /**
   * Lista duplicatas paginadas
   * @param page página (0-based)
   * @param size tamanho da página
   */
  listarPaginadas(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginadas`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  /**
   * Lista duplicatas filtradas por número ou descrição e paginadas
   * @param page página (0-based)
   * @param size tamanho da página
   * @param numero número da duplicata (opcional)
   */
  listarPorNumero(page: number, size: number, numero?: string): Observable<any> {
      const params: any = { page: page.toString(), size: size.toString() };
      if (numero) params.numero = numero; // só envia número

      return this.http.get(`${this.apiUrl}/por-numero`, { params });
  }
}
