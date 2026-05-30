import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/serviceSupabase';
import { Turma } from '../interfaces/turma';
import { adaptarTurmaParaRequest, adaptarTurmaParaResponse } from '../shared/adapters/turma.adapter'

@Injectable({
  providedIn: 'root'
})
export class ServiceTurma {

  private tabela = 'turma'


  constructor(private supabase: SupabaseService) {
  }

  cadastrarTurma(turma: Turma): Observable<Turma> {

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
          (item: any) => adaptarTurmaParaResponse(item)
        );
      })
    );
  }

  listarTurmasAtivas(): Observable<Turma[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*')
        .eq('situacao', '1')
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
