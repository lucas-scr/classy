import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Contrato } from '../interfaces/contrato';
import { adaptarContratoParaResponse, adapterContratoParaRequest } from '../shared/adapters/contrato.adapter';
import { SupabaseService } from '../core/services/serviceSupabase';
import { DiasDaSemana } from '../shared/Enums/enumDiasDaSemana';
import { error } from 'pdf-lib';

@Injectable({
  providedIn: 'root', // Torna o serviço disponível globalmente
})
export class ServiceContratos {

  private tabela = 'contrato';
  private tabelaAluno = 'aluno';
  private tabelaDiasAula = 'dias_aulas'

  constructor(private supabase: SupabaseService) { }

  findById(id: number): Observable<Contrato> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select("*")
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

        const client = this.supabase.getClient();
        const payloadContrato = adapterContratoParaRequest(contrato);
        
        const { data: contratoData, error: contratoError } = await client
          .from(this.tabela)
          .insert(payloadContrato)
          .select()
          .single();

        if (contratoError) throw contratoError;

        const contratoId = contratoData.id;

        try{
          let alunoId: number | undefined;
          if(contrato.aluno){
            const {data: alunoData, error: alunoError} = await client
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

            const {error: diasError} = await client
            .from(this.tabelaDiasAula)
            .insert(diasPayload);
            if(diasError) {
              throw diasError;
            };
            
           }
          return adaptarContratoParaResponse(contratoData);
        } catch (err) {
        await client.from(this.tabela).delete().eq("id", contratoId);
        await client.from(this.tabelaAluno).delete().eq("contrato_id", contratoId);
        await client.from(this.tabelaDiasAula).delete().eq("contrato_id", contratoId);
        throw err;
        }
      })()
  ); 
}


atualizarContrato(id: number, contrato: Contrato): Observable < Contrato > {
  const payload = adapterContratoParaRequest(contrato);
  return from(
    this.supabase.getClient()
      .from(this.tabela)
      .update(payload)
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
