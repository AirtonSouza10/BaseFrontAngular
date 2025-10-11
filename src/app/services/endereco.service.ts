import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EnderecoDTO {
  id?: number;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
  cep: string;
  tipoEndereco?: any;
}

@Injectable({ providedIn: 'root' })
export class EnderecoService {

  private readonly baseUrl = environment.apiUrl+'/enderecos';

  constructor(private readonly http: HttpClient) { }

  /** Consulta endereço pelo CEP via API */
  buscarPorCep(cep: string): Observable<Partial<EnderecoDTO>> {
    return this.http.get<any>(`${this.baseUrl}/cep/${cep}`).pipe(
      map(res => res.resposta as Partial<EnderecoDTO>)
    );
  }
}
