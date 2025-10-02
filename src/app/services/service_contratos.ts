import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Contrato } from '../interfaces/contrato';
import { adaptarContratoParaResponse, adapterContratoParaRequest } from '../shared/adapters/contrato.adapter';
import { SupabaseService } from '../core/services/serviceSupabase';
import { DiasDaSemana } from '../shared/Enums/enumDiasDaSemana';
import { error } from 'pdf-lib';
import { adaptarTurmaParaResponse } from '../shared/adapters/turma.adapter';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível globalmente
})
export class ServiceContratos {

  private tabela = 'contrato';
  private tabelaAluno = 'aluno';
  private tabelaDiasAula = 'dias_aulas';
  private client = undefined



  constructor(private supabase: SupabaseService) {
    this.client = this.supabase.getClient();
  }

  findById(id: number): Observable<Contrato> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select("*, aluno(*), turma(*), dias_aulas(*)")
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    )
  }


  findByAluno(idAluno: number): Observable<Contrato> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select("*, turma(*), dias_aulas(*)")
        .eq('aluno', idAluno)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    )
  }

  listarContratos(): Observable<Contrato[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*, aluno(*), turma(*)')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(
          (item: any) => adaptarContratoParaResponse(item)
        );
      })
    );
  }

  cadastrarContrato(contrato: Contrato): Observable<Contrato> {

    return from(
      (async () => {

        try {
          if (contrato.aluno) {
            const { data: alunoData, error: alunoError } = await this.client
              .from(this.tabelaAluno)
              .insert({
                nome: contrato.aluno.nome,
                data_nascimento: contrato.aluno.dataNascimento.toISOString().split('T')[0],
                sexo: contrato.aluno.sexo,
              })
              .select()
              .single();
            if (alunoError) throw alunoError;
            contrato.aluno.id = alunoData.id
          }

          const payloadContrato = adapterContratoParaRequest(contrato);
          payloadContrato.aluno = contrato.aluno.id;

          const { data: contratoData, error: contratoError } = await this.client
            .from(this.tabela)
            .insert(payloadContrato)
            .select()
            .single();

          if (contratoError) throw contratoError;

          contrato.id = contratoData.id;
      
          if (!contrato.diasAlternados && contrato.diasDasAulas.length > 0) {
            const diasPayload = contrato.diasDasAulas.map((dia: any) => ({
              contrato: contrato.id,
              horario: dia.horario,
              dia_semana: dia.diaSemana
            }));

            const {data: diasAulasData, error: diasError } = await this.client
              .from(this.tabelaDiasAula)
              .insert(diasPayload);

            if (diasError) {
              console.log("erro dias da semana", diasError)
              throw diasError;
            };

          }
       
          return adaptarContratoParaResponse(contratoData);
        } catch (err) {
          await this.client.from(this.tabela).delete().eq("id", contrato.id);
          await this.client.from(this.tabelaAluno).delete().eq("id", contrato.aluno.id);
          await this.client.from(this.tabelaDiasAula).delete().eq("contrato", contrato.id);
          throw err;
        }
      })()
    );
  }


  atualizarContrato(contrato: Contrato): Observable<Contrato> {
    if (!contrato.id) {
      throw new Error("Contrato sem ID não pode ser atualizado.")
    }
    return from(
      (async () => {
              const { data: contratoData, error: contratoError} = await  this.client
        .from(this.tabela)
        .update(adapterContratoParaRequest(contrato))
        .eq('id', contrato.id)
        .select()
        .single()

        if(contratoError) throw contratoError

        const { error: deleteError} = await this.client
        .from('dias_aulas')
        .delete()
        .eq('contrato', contrato.id);

        if(deleteError) throw deleteError

        if(contrato.diasDasAulas && contrato.diasDasAulas.length > 0){
          const payloadDias = contrato.diasDasAulas.map((dia) => ({
          contrato: contrato.id,
          dia_semana: dia.diaSemana,
          horario: dia.horario
        }));

        const { error: insertError} = await this.client
        .from('dias_aulas')
        .insert(payloadDias)

        if(insertError) throw insertError
        }

        const {data: contratoFinal, error: selectError} = await this.client
        .from(this.tabela)
        .select('*, dias_aulas(*)')
        .eq('id', contrato.id)
        .single()

        if(selectError) throw selectError

        return adaptarContratoParaResponse(contratoFinal)

      })()
    );
  }

  removerContrato(id: number): Observable<Contrato> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .delete()
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error })  => {
        if (error) throw error;
        return adaptarContratoParaResponse(data);
      })
    );
  }

    tratarErro(error: any){
    this.supabase.handleError(error)
  }
  
}
