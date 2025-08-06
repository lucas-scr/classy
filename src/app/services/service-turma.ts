import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/SupaBaseService';
import { Turma } from '../interfaces/turma';
import { adaptarTurmaParaRequest, adaptarTurmaParaResponse } from '../shared/adapters/turma.adapter'
import { adaptarContratoParaResponse } from '../shared/adapters/contrato.adapter';

@Injectable({
  providedIn: 'root'
})
export class ServiceTurma {

  private tabela = 'turma'


  constructor(private supabase: SupabaseService) { 
  }

  cadastrarTurma(turma: Turma): Observable<Turma> {
     
    this.supabase.getUser().then((data) => {
      console.log(data.data.user);
      data.data.user;
      turma.user_id = data.data.user?.id;
    });

    const payload = adaptarTurmaParaRequest(turma);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarTurmaParaResponse(data);
      })
    );
  }


  listarTurmas(): Observable<Turma[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(
          (item: any) => ({
            id: item.id,
            nome: item.nome,
            situacao: item.situacao
          })
        );
      })
    );
  }


  removerTurma(id: number): Observable<Turma> {
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
        return adaptarTurmaParaResponse(data);
      })
    );
  }
}
