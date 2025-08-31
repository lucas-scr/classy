
import { Injectable } from '@angular/core';

import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarAlunoParaResponse } from '../shared/adapters/aluno.adapter';
import { Aluno } from '../interfaces/aluno';
import { ServiceContratos } from './service_contratos';

@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})

export class ServiceAlunos {
  private tabela = 'aluno';
  private tabelaContrato = 'contrat'

  constructor(
    private supabaseService: SupabaseService,
    private contratoService: ServiceContratos
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
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(
          (item: any) => {

            return adaptarAlunoParaResponse(item)
          }
        )
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

  adicionarAlunoNaLista(aluno: Aluno): Observable<Aluno> {
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

  atualizarAlunoNalista(id: number, aluno: Aluno): Observable<Aluno> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .update(aluno)
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
}
