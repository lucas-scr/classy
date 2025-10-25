
import { Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarAlunoParaRequest, adaptarAlunoParaResponse } from '../shared/adapters/aluno.adapter';
import { Aluno } from '../interfaces/aluno';
import { PostgrestResponse } from '@supabase/supabase-js';
import { HistoricoAtividade } from '../interfaces/historico-atividade';


@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})

export class ServiceAlunos {
  private tabela = 'aluno';
  private tabelaHistoricoAtividades = 'historico_atividades'

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
          return adaptarAlunoParaResponse(item)
        });
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

  tratarErro(error: any) {
    this.supabaseService.handleError(error)
  }

  obterHistoricoAtividadesPorAluno(aluno_id: number): Observable<HistoricoAtividade[]> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabelaHistoricoAtividades)
        .select('atividade(descricao, codigo, materia(nome)), aula_id, descricao, created_at')
        .eq('aluno_id', aluno_id))
      .pipe(
        map(({ data, error }) => {
          console.log(data)
          if (error) throw error;
          return (data || []).map((item: any): HistoricoAtividade => ({
            id: item.id,
            codigo_atividade: item.codigo,
            materia: item.atividade.materia.nome,
            nome_atividade: item.atividade.descricao,
            descricao: item.descricao,
            data_criacao: item.created_at,
            atividade_id: item.atividade_id
          })
          )
        }
        )
      )
  }

  lançarAtividade(historico_atividades: HistoricoAtividade): Observable<any> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabelaHistoricoAtividades)
        .insert({
          aluno_id: historico_atividades.aluno_id,
          atividade_id: historico_atividades.atividade_id,
          aula_id: historico_atividades.aula_id,
          descricao: historico_atividades.descricao
        })
        .select('atividade(descricao, codigo, materia(nome)), id, aula_id, descricao, created_at')
        .single()
    ).pipe(
      map((data, error) => {
        if (error) throw error
        console.log(data)
        return data
      })
    )
  }

  obterUltimaAtividadeDoAluno(aluno_id: number): Observable<HistoricoAtividade[]> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabelaHistoricoAtividades)
        .select('atividade(descricao, codigo, materia(nome)), aula_id, descricao, created_at')
        .eq('aluno_id', aluno_id)
        .order('created_at', { ascending: false })
        .limit(3)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map((item: any): HistoricoAtividade => ({
          id: item.id,
          codigo_atividade: item.atividade.codigo,
          materia: item.atividade.materia.nome,
          nome_atividade: item.atividade.descricao,
          descricao: item.descricao,
          data_criacao: item.created_at,
          atividade_id: item.atividade_id
        })
        );
      })
    );
  }

}
