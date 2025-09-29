import { Injectable } from '@angular/core';
import { SupabaseService } from '../core/services/serviceSupabase';
import { from, map, Observable } from 'rxjs';
import { Aula, AulasPorIntervalo } from '../interfaces/aula';
import { ServiceContratos } from './service_contratos';
import { adaptarAlunoParaResponse } from '../shared/adapters/aluno.adapter';
import { Aluno } from '../interfaces/aluno';

@Injectable({
  providedIn: 'root'
})
export class ServiceHome {

  tabela = 'aulas'

  constructor(private supabase: SupabaseService, private serviceContrato: ServiceContratos) {
  }


  getAulasDoDia(data: Date): Observable<Aula[]> {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0); // 00:00 do dia
    const fim = new Date(data);
    fim.setHours(23, 59, 59, 999); // 23:59 do dia


    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select(` 
          id,      
          data,      
          situacao,      
      contrato ( id,
      aluno(id, nome, data_nascimento, sexo))`)
        .gte('data', inicio.toISOString())
        .lte('data', fim.toISOString())
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map((aula: any) => ({
          id: aula.id,
          data: new Date(aula.data),
          situacao: aula.situacao,
          contrato_id: aula.contrato?.id,
          aluno: adaptarAlunoParaResponse(aula.contrato?.aluno) as Aluno
        } as Aula));
      })
    );
  }



  ajustarMinutosParaIntervalo(data: Date): Date {
    if (data.getMinutes() < 30) {
      data.setMinutes(0, 0, 0)
      return data
    } 
    data.setMinutes(30, 0, 0)
    return data
  }

  gerarIntervalosDeAulasParaODia(data: Date): Date[] {
    let listaIntervalos: Date[] = [];
    let intervaloEmMinutos: number = 30
    let qtdIntervalos: number = (24 * 60) / intervaloEmMinutos;

    data.setHours(8, 0, 0, 0)

    for (let i = 0; i < qtdIntervalos - 20; i++) {
      data.setMinutes(data.getMinutes() + intervaloEmMinutos);
      listaIntervalos.push(new Date(data));
    }
  
    return listaIntervalos;
  }


  atribuirAulasDoDiaAoIntervalo(dataAtual: Date): AulasPorIntervalo[] {
    let listaIntervalosComAulas: AulasPorIntervalo[] = []
    let listaIntervalos: Date [] = this.gerarIntervalosDeAulasParaODia(new Date(dataAtual));
    this.getAulasDoDia(dataAtual).subscribe({
      next: (aulasDoDia: Aula []) => {
        listaIntervalos.forEach((intervalo) => {
          let aulasDoIntervalo: Aula[] = [];
          for (let aula of aulasDoDia){
       
            const horaIgual = this.ajustarMinutosParaIntervalo(aula.data).getHours() === intervalo.getHours() &&
            this.ajustarMinutosParaIntervalo(aula.data).getMinutes() === intervalo.getMinutes();

            if(horaIgual) {
              aulasDoIntervalo.push(aula)
            }
          }
          listaIntervalosComAulas.push({
            data: intervalo,
            aulas: aulasDoIntervalo
          });
        });
      },
      error: (err) => console.log(err)
    });
    return listaIntervalosComAulas;
  }
}
