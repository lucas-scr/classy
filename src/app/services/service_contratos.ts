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

        
        const payloadContrato = adapterContratoParaRequest(contrato);
        
        const { data: contratoData, error: contratoError } = await this.client
          .from(this.tabela)
          .insert(payloadContrato)
          .select()
          .single();

        if (contratoError) throw contratoError;

        const contratoId = contratoData.id;

        try{
          let alunoId: number | undefined;
          if(contrato.aluno){
            const {data: alunoData, error: alunoError} = await this.client
            .from(this.tabelaAluno)
            .insert({
              nome: contrato.aluno.nome,
              data_nascimento: contrato.aluno.dataNascimento.toISOString().split('T')[0],
              sexo: contrato.aluno.sexo,
              contrato: contratoId
              })
            .select()
            .single();
            if(alunoError) throw alunoError;
            alunoId = alunoData.id
            contratoData.aluno = alunoData;
          }
           if(!contrato.diasAlternados && contrato.diasDasAulas.length > 0){
            const diasPayload = contrato.diasDasAulas.map((dia: any) => ({
              contrato: contratoId,
              horario: dia.horario,
              dia_semana: dia.diaSemana
            }));

            const {error: diasError} = await this.client
            .from(this.tabelaDiasAula)
            .insert(diasPayload);
            if(diasError) {
              throw diasError;
            };
            
           }
          return adaptarContratoParaResponse(contratoData);
        } catch (err) {
        await this.client.from(this.tabela).delete().eq("id", contratoId);
        await this.client.from(this.tabelaAluno).delete().eq("contrato_id", contratoId);
        await this.client.from(this.tabelaDiasAula).delete().eq("contrato_id", contratoId);
        throw err;
        }
      })()
  ); 
}


atualizarContrato(contrato: Contrato): Observable < Contrato > {
  return from(
    (async () => {
      if(!contrato.id){
        throw new Error("Contrato sem ID não pode ser atualizado.")
      }
      const payloadContrato = adapterContratoParaRequest(contrato);

      const { data: contratoData, error: contratoError} = await this.client
      .from(this.tabela)
      .update(payloadContrato)
      .eq("id", contrato.id)
      .select()
      .single();

      if(contratoError) throw contratoError;

      try{
        let alunoId: number | undefined;

        if(contrato.aluno){
          if(contrato.aluno.id){
            const {data: alunoData, error: alunoError} =  await this.client
            .from(this.tabelaAluno)
            .update({
              nome: contrato.aluno.nome,
              data_nascimento: contrato.aluno.dataNascimento,
              sexo: contrato.aluno.sexo
            })
            .eq("id", contrato.aluno.id)
            .select()
            .single()

            if(alunoError) throw alunoError;
            alunoId = alunoData.id;
            contratoData.aluno = alunoData;
          }
        }

        if(!contrato.diasAlternados){
          await this.client
          .from(this.tabelaDiasAula)
          .delete()
          .eq("contrato", contrato.id)

          if(contrato.diasDasAulas.length > 0){
            const diasPayload = contrato.diasDasAulas.map((dia: any) => ({
              contrato: contrato.id,
              horario: dia.horario,
              dia_semana: dia.semana,
            }));

            const {error: diasError} = await this.client
            .from(this.tabelaDiasAula)
            .insert(diasPayload);

            if(diasError) throw diasError;

          }
        }

        return adaptarContratoParaResponse(contratoData)
      }catch(err){
        throw err;
      }
    })()
  );
}

removerContrato(id: number): Observable < Contrato > {
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
      return adaptarContratoParaResponse(data);
    })
  );
}
}
