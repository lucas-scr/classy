import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Materia } from '../interfaces/materias';
import { SupabaseService } from '../core/services/serviceSupabase';


@Injectable({
  providedIn: 'root',
})
export class ServiceMateria {
    private tabela = 'materia';

    constructor( private supabaseService: SupabaseService){
    }

     getMaterias(): Observable<Materia[]> {
    return from(
      this.supabaseService.getClient()
        .from(this.tabela)
        .select('id, nome')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  consultarPorId(id: number): Observable<Materia> {
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
}