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
          reposicao, 
      contrato ( id,
      aluno(id, nome, data_nascimento, sexo))`)
        .gte('data', inicio.toISOString())
        .lte('data', fim.toISOString())
        .in('situacao', [0, 1])
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map((aula: any) => ({
          id: aula.id,
          data: new Date(aula.data),
          situacao: aula.situacao,
          reposicao: aula.reposicao,
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

    data.setHours(9, 0, 0, 0)

    for (let i = 0; i < qtdIntervalos - 25; i++) {
      data.setMinutes(data.getMinutes() + intervaloEmMinutos);
      listaIntervalos.push(new Date(data));
    }

    return listaIntervalos;
  }


  atribuirAulasDoDiaAoIntervalo(dataAtual: Date): Observable<AulasPorIntervalo[]> {

    let listaIntervalos: Date[] = this.gerarIntervalosDeAulasParaODia(new Date(dataAtual));

    return this.getAulasDoDia(dataAtual).pipe(
      map((aulasDoDia: Aula[]) => {
        let listaIntervalosComAulas: AulasPorIntervalo[] = [];

        listaIntervalos.forEach((intervalo) => {
          let aulasDoIntervalo: Aula[] = []

          for (let aula of aulasDoDia) {
            const horaIgual =
              this.ajustarMinutosParaIntervalo(aula.data).getHours() === intervalo.getHours() &&
              this.ajustarMinutosParaIntervalo(aula.data).getMinutes() === intervalo.getMinutes();
              // exemplo: 10:30 precisa aparecer em 10:30

              const horaMaior30minutos =
              this.ajustarMinutosParaIntervalo(aula.data).getHours() === intervalo.getHours() &&
              this.ajustarMinutosParaIntervalo(aula.data).getMinutes() === intervalo.getMinutes() - 30;
              // exemplo: 10:30 precisa aparecer em 11:00

              const horaMaior1hora =
              this.ajustarMinutosParaIntervalo(aula.data).getHours() + 1 === intervalo.getHours()
              // exemplo: 10:30 precisa aparecer em 11:30

              const horaMaior1horaE30Minutos = 
              this.ajustarMinutosParaIntervalo(aula.data).getHours() + 1 === intervalo.getHours() &&
              this.ajustarMinutosParaIntervalo(aula.data).getMinutes() === intervalo.getMinutes() - 30;
              // exemplo: 10:00 precisa aparecer em 11:30

              //  const horaMaiorIniciandoCom30Minutos = 
              // this.ajustarMinutosParaIntervalo(aula.data).getHours() + 2 === intervalo.getHours() &&
              // this.ajustarMinutosParaIntervalo(aula.data).getMinutes() - 30 === intervalo.getMinutes();
              // exemplo: 10:30 precisa aparecer em 12:00
              




            if (horaIgual || horaMaior30minutos || horaMaior1hora || horaMaior1horaE30Minutos ) {
              aulasDoIntervalo.push(aula)
            }
          }
          listaIntervalosComAulas.push({
            data: intervalo,
            aulas: aulasDoIntervalo
          });
        });
        
        return listaIntervalosComAulas
      })
    )
  }
     tratarErro(error: any){
    this.supabase.handleError(error)
  }
}
