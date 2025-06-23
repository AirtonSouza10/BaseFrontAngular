import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewFormResponse } from '../interfaces/newFormResponse';

@Injectable({
  providedIn: 'root'
})
export class NewformService {
  privateEndPointURL = 'http://teste.com.com';
  constructor(private http: HttpClient) { }

  sendData(nome:String, email:String): Observable<NewFormResponse >{
    const data = {nome, email};
    return this.http.post<NewFormResponse >(this.privateEndPointURL,data);
  }
}
