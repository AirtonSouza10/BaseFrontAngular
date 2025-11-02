import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TelefoneDTO {
  id?: number;
  tpTelefone: any;
  numero: string;
  tpTelefoneId: number;
}

export interface EnderecoDTO {
  id?: number;
  tipoEndereco: any;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
  cep: string;
  enderecoTipoId: number;
}

export interface FornecedorDTO {
  id?: number;
  nome: string;
  razao: string;
  identificacao: string;
  email?: string;
  telefones: TelefoneDTO[];
  enderecos: EnderecoDTO[];
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private readonly apiUrl = `${environment.apiUrl}/fornecedores`;

  constructor(private readonly http: HttpClient) {}

  /** Lista todos os fornecedores */
  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Busca fornecedor por ID */
  buscarPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /** Salva novo fornecedor */
  salvar(dto: FornecedorDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  /** Atualiza fornecedor existente */
  atualizar(id: number, dto: FornecedorDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  /** Ativa ou inativa fornecedor */
  atualizarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, ativo);
  }

  /** Gera relatório de fornecedores (PDF) */
  gerarRelatorio(): Observable<Blob> {
    const url = `${this.apiUrl}/relatorio-fornecedores`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
