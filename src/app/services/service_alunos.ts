
import { Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarAlunoParaRequest, adaptarAlunoParaResponse } from '../shared/adapters/aluno.adapter';
import { Aluno } from '../interfaces/aluno';
import { PostgrestResponse } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})

export class ServiceAlunos {
  private tabela = 'aluno';

  constructor(
    private supabaseService: SupabaseService,
  ) {

  }

obterAlunos(): Observable<Aluno[]> {
  return from(
    this.supabaseService.getClient()
      .from(this.tabela)
      .select(`*, contrato:contrato(*, dias_aulas(horario, dia_semana))`)
      .eq('contrato.situacao', 1)
      .order('created_at', { foreignTable: 'contrato', ascending: false })
      .limit(1, { foreignTable: 'contrato' })
  ).pipe(
    map((res: PostgrestResponse<Aluno>) => {
      if (res.error) throw res.error;
      return (res.data || []).map((item: any) => {
        return adaptarAlunoParaResponse(item)});
    })
  );
}

  findById(id: number): Observable<Aluno> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarAlunoParaResponse(data);
      })
    );
  }

  cadastrarAluno(aluno: Aluno): Observable<Aluno> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .insert(aluno)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }




  atualizarAluno(aluno: Aluno): Observable<Aluno> {
    if (!aluno.id) throw new Error('ID do aluno é obrigatório para atualização');
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .update(adaptarAlunoParaRequest(aluno))
        .eq('id', aluno.id)
        .select()
        .single()
      ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarAlunoParaResponse(data);
      })
    );
  }

  removerAluno(id: number): Observable<Aluno> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .delete()
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

   tratarErro(error: any){
    this.supabaseService.handleError(error)
  }
}
