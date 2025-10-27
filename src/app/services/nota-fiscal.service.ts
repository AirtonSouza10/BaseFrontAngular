import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ParcelaPrevistaNotaDTO {
  id?: number;
  dtVencimentoPrevisto: string | Date;
  valorPrevisto: number;
}

export interface NotaFiscalDTO {
  id?: number;
  numero: string;
  serie: string;
  chave: string;
  descricaoObs?: string;
  valorTotal: number;
  valorDesconto?: number;
  valorIcms?: number;
  valorJuros?: number;
  valorMulta?: number;
  dtCompra: string | Date;
  fornecedorId: number;
  fornecedorNome: string;
  tipoNotaId: number;
  pessoaId?: number;
  filialId: number;
  formaPagamentoId: number;
  parcelasPrevistas?: ParcelaPrevistaNotaDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private readonly apiUrl = `${environment.apiUrl}/nota-fiscal`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  salvar(dto: NotaFiscalDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  atualizar(id: number, dto: NotaFiscalDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarPorNumeroEFornecedor(numero: number, fornecedorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar`, {
      params: { numero: numero.toString(), fornecedorId: fornecedorId.toString() }
    });
  }

  /**
   * Lista notas fiscais paginadas filtrando por número e/ou fornecedor
   * @param page número da página (0-based)
   * @param size quantidade por página
   * @param numero filtro por número da nota (opcional)
   * @param fornecedorId filtro por fornecedor (opcional)
   */
  listarPaginadasByFornecedorAndNumero(page: number, size: number, numero?: string, fornecedorId?: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/por-numero-fornecedor`, {
      params: {
        page: page.toString(),
        size: size.toString(),
        ...(numero ? { numero } : {}),
        ...(fornecedorId ? { fornecedorId: fornecedorId.toString() } : {})
      }
    });
  }

  /**
 * Lista todas as notas fiscais paginadas
 * @param page número da página (0-based)
 * @param size quantidade por página
 */
  listarPaginadas(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginadas`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }
}
