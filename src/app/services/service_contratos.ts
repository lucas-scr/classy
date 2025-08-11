import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Contrato } from '../interfaces/contrato';
import { adaptarContratoParaResponse, adapterContratoParaRequest } from '../shared/adapters/contrato.adapter';
import { SupabaseService } from '../core/services/serviceSupabase';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível globalmente
})
export class ServiceContratos {

  private tabela = 'contrato';

  constructor(private supabase: SupabaseService) {}

  findById(id: number): Observable<Contrato> {
    return from (
      this.supabase.getClient()
      .from(this.tabela)
      .select("*")
      .eq('id', id)
      .single()
    ).pipe(
      map(({data, error}) =>{
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      } )
    )
  }

  listarContratos(): Observable<Contrato[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(adaptarContratoParaResponse);
      })
    );
  }

  cadastrarContrato(contrato: Contrato): Observable<Contrato> {
    const payload = adapterContratoParaRequest(contrato);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    );
  }

   atualizarContrato(id: number, contrato: Contrato): Observable<Contrato> {
    const payload = adapterContratoParaRequest(contrato);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    );
  }
  
  removerContrato(id: number): Observable<Contrato> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .delete()
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    );
    }
}
