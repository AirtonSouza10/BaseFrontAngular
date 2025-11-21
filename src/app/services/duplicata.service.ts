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
  fornecedorId: number;
  filialId: number;
  dsFornecedor: string;
  dsFilial: string;
  formaPagamentoId: number;
  parcelas?: ParcelaDTO[];
  notasFiscais?: NotaFiscalDTO[];
  tipoId?: number;
}

export interface DuplicataDiaResponseDTO {
  id?: number;
  filial?: string;
  descricao?: string;
  fornecedor?: string;
  identificacaoFornecedor?: string;
  valor?: number;
  valorFormatado?: string;
  situacao?: string;
  dtVencimento?: string | Date;
  dtVendimentoFormatada?: string;
  prevista?: boolean;
}

export interface BaixaParcelaRequestDTO {
  id?: number;
  dtPagamento: string | Date;
  valorPago: number;
  observacao?: string;
  tipoPagamentoId?: number;
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

  obterContasPagarDia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dia`);
  }

  obterContasPagarVencida(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vencida`);
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

  /**
   * Busca duplicatas por descrição (sem paginação)
   * @param descricao descrição a ser buscada
   */
    buscarPorDescricao(descricao: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/descricao`, {
        params: { descricao }
      });
    }

    /** Gera relatório de fornecedores (PDF) */
    gerarRelatorioDia(): Observable<Blob> {
      const url = `${this.apiUrl}/relatorio-dia`;
      return this.http.get(url, { responseType: 'blob' });
    }

      /**
   * Obtém o relatório de contas a pagar em aberto por filial (JSON)
   */
    obterRelatorioContasEmAbertoPorFilial(idFilial: number): Observable<any> {
      const url = `${this.apiUrl}/relatorio-aberto-filial/${idFilial}`;
      return this.http.get<any>(url);
    }
    /**
     * Gera o relatório de contas a pagar em aberto por filial (PDF)
     */
    gerarRelatorioContasEmAbertoPorFilialPDF(idFilial: number): Observable<Blob> {
      const url = `${this.apiUrl}/relatorio-contas-pagar-filial/${idFilial}`;
      return this.http.get(url, { responseType: 'blob' });
    }

    /**
     * Realiza a baixa (pagamento) de uma parcela
     * @param id ID da parcela
     * @param dto dados da baixa (pagamento)
     */
    baixarParcela(id: number, dto: BaixaParcelaRequestDTO): Observable<any> {
      const url = `${this.apiUrl}/baixa`;
      return this.http.put<any>(url, dto);
    }

    /**
     * Busca uma parcela pelo ID
     * @param id ID da parcela
     */
    buscarParcelaPorId(id: number): Observable<any> {
      const url = `${this.apiUrl}/buscar-parcela/${id}`;
      return this.http.get<any>(url);
    }

    /**
   * Obtém o relatório de parcelas pagas por tipo de título (JSON)
   */
  obterRelatorioParcelasPagasPorTipo(
    idFilial: number,
    dataInicial: string,
    dataFinal: string
  ): Observable<any> {
    const url = `${this.apiUrl}/relatorio-parcelas-pagas`;

    return this.http.get<any>(url, {
      params: {
        idFilial,
        dataInicial,
        dataFinal
      }
    });
  }

    /**
     * Gera relatório de parcelas pagas por tipo (PDF)
     */
    gerarRelatorioParcelasPagasPorTipoPDF(
      idFilial: number,
      dataInicial: string,
      dataFinal: string
    ): Observable<Blob> {
      const url = `${this.apiUrl}/relatorio-parcelas-pagas-por-tipo/${idFilial}`;

      return this.http.get(url, {
        params: {
          dataInicial,
          dataFinal
        },
        responseType: 'blob'
      });
    }

    obterRelatorioCustomizado(filtro: any): Observable<any> {
      const url = `${this.apiUrl}/relatorio-customizado`;
      return this.http.post<any>(url, filtro);
    }

    gerarRelatorioCustomizadoPDF(filtro: any): Observable<Blob> {
      const url = `${this.apiUrl}/relatorio-customizado/pdf`;
      return this.http.post(url, filtro, { responseType: 'blob' });
    }

    buscarGeral(termo: string, pagina: number = 0, tamanho: number = 10): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/busca-geral`, {
        params: {
          termo,
          pagina,
          tamanho
        }
      });
    }

    buscarGeralAtivas(termo: string, pagina: number = 0, tamanho: number = 10): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/busca-geral-ativas`, {
        params: {
          termo,
          pagina,
          tamanho
        }
      });
    }

}
