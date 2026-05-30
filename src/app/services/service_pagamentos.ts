import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Pagamento } from '../interfaces/pagamentos';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarPagamentoParaRequest, adaptarPagamentoParaResponse } from '../shared/adapters/pagamento.adapter';

@Injectable({
  providedIn: 'root',
})
export class ServicePagamentos {
  private tabela = 'pagamento'

  constructor(private supabase: SupabaseService) {
  }


  postPagamento(pagamento: Pagamento): Observable<Pagamento> {
    const payload = adaptarPagamentoParaRequest(pagamento);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarPagamentoParaResponse(data);
      })
    );
  }

  getPagamentos(): Observable<Pagamento[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select(`*, contrato:contrato_id(*, aluno:aluno(*))`)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(
           (item: any) => adaptarPagamentoParaResponse(item)
        )
      })
    );
  }

    getPagamento(id:number): Observable<Pagamento> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select(`*, contrato:contrato_id(*, aluno:aluno(*))`)
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarPagamentoParaResponse(data)
      })
    );
  }

  cancelarPagamento(id: number, motivo: string){
        return from(
          this.supabase.getClient()
            .from(this.tabela)
            .update({
              situacao: 0,
              motivo_cancelamento: motivo
            })
            .eq('id', id)
            .select()
            .single()
        ).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return (data);
          })
        );
  }

}
