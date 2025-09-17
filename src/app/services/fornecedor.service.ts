import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TelefoneDTO {
  numero: string;
  tpTelefoneId: number;
}

export interface EnderecoDTO {
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
  identificacao: string;
  tpIdentificacao: string;
  email?: string;
  telefones: TelefoneDTO[];
  enderecos: EnderecoDTO[];
}

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private readonly apiUrl = `${environment.apiUrl}/fornecedores`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  salvar(dto: FornecedorDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  atualizar(id: number, dto: FornecedorDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }
}
