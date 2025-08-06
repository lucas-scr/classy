
import { Injectable } from '@angular/core';
import { Aluno } from '../model/Alunos';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '../core/services/SupaBaseService';



@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})


export class ServiceAlunos {

    private tabela = 'aluno';


    constructor (private supabaseService: SupabaseService){
        
    }

  obterAlunos(): Observable<Aluno[]> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
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
        return data;
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
