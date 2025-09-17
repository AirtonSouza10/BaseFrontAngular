import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TipoService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  listarTiposTelefone(): Observable<any> {
    return this.http.get(`${this.baseUrl}/telefones`);
  }

  listarTiposEndereco(): Observable<any> {
    return this.http.get(`${this.baseUrl}/enderecos`);
  }
}
