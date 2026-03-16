import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Materia } from '../interfaces/materias';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarMateriaParaRequest, adaptarMateriaResponse } from '../shared/adapters/materia.adapter';


@Injectable({
  providedIn: 'root',
})
export class ServiceMateria {
  private tabela = 'materia';

  constructor(private supabaseService: SupabaseService) {
  }

  cadastrarMateria(materia: Materia): Observable<Materia> {
    const payload = adaptarMateriaParaRequest(materia);
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarMateriaParaRequest(data);
      })
    );
  }


  atualizarMateria(materia: Materia): Observable<Materia> {
    if (!materia.id) throw new Error('ID da materia é obrigatório para atualização');
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .update(adaptarMateriaParaRequest(materia))
        .eq('id', materia.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarMateriaResponse(data);
      })
    );
  }



  getMaterias(): Observable<Materia[]> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(
          (item: any) => adaptarMateriaResponse(item)
        );
      })
    );
  }

  getById(id: number): Observable<Materia> {
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

  tratarErro(error: any) {
    this.supabaseService.handleError(error)
  }


  removerMateria(id: number): Observable<Materia> {
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
        return adaptarMateriaResponse(data);
      })
    );
  }
}