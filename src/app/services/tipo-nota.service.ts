import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoNotaDTO } from '../models/tipo-nota.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TipoNotaService {
  private readonly apiUrl = `${environment.apiUrl}/tipo-nota`;

  constructor(private readonly http: HttpClient) {}

  salvar(dto: TipoNotaDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

    // Listar todos os tipos de nota
  listarTiposNota(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
