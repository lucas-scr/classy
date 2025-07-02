import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Contrato } from '../interfaces/contrato';
import { adaptarContratoParaResponse, adapterContratoParaRequest } from '../shared/adapters/contrato.adapter';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível globalmente
})
export class ServiceContratos {

  private URL = 'http://localhost:8080/api/contratos';

  constructor(private http: HttpClient) {

  }

  findById(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.URL}/${id}`).pipe(
       map(adaptarContratoParaResponse)
    );
  }

  listarContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.URL).pipe(
      map(dados => dados.map(adaptarContratoParaResponse))
    )
  }

  cadastrarContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.URL, adapterContratoParaRequest(contrato));
  }
  
  atualizarContrato(id: number, contrato: Contrato): Observable<Contrato> {
    console.log(adapterContratoParaRequest(contrato));
    return this.http.put<Contrato>(`${this.URL}/${id}`, adapterContratoParaRequest(contrato));
  }
  
  removerContrato(id: Number): Observable<Contrato> {
    return this.http.delete<Contrato>(`${this.URL}/${id}`);
  }
}
