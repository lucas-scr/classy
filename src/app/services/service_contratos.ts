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
  private tabelaDiasAula = 'diasAula'

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
        console.log(data)
        return (data || []).map(
          (item: any) => adaptarContratoParaResponse(item)
        );
      })
    );
  }

  cadastrarContrato(contrato: Contrato): Observable<Contrato> {

    return from(
      (async () => {
        let alunoId: number | undefined

        if (contrato.aluno) {
          const { error: alunoError, data: alunoData } = await this.supabase.getClient()
            .from(this.tabelaAluno)
            .insert(contrato.aluno)
            .select()
            .single()

          if (alunoError) throw alunoError;
          alunoId = alunoData.id;
        }

        const payloadContrato = adapterContratoParaRequest({
          ...contrato,
          aluno_id: alunoId ?? contrato.aluno.id
        });

        const { error: contratoError, data: contratoData } = await this.supabase.getClient()
          .from(this.tabela)
          .insert(payloadContrato)
          .select()
          .single();

        if (contratoError) throw contratoError;

        const contratoId = contratoData.id;

        console.log(payloadContrato);

        if (contrato.diasAlternados == false && contrato.diasDasAulas.length > 0) {
          const diasPayload = contrato.diasDasAulas.map((dia: any) => ({
            contrato_id: contratoId,
            horario: dia.horario,
            DiasDaSemana: dia.dia_semana
          }));

          const { error: diasError } = await this.supabase.getClient()
            .from(this.tabelaDiasAula)
            .insert(diasPayload)

          if (diasError) throw diasError
        }

      return adaptarContratoParaResponse(contratoData);
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
