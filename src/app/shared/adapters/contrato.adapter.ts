import { Contrato } from "../../interfaces/contrato";
import { DiasDaSemana } from "../Enums/enumDiasDaSemana";
import { Situacoes, SituacoesTurmaPorId } from "../Enums/enumSituacoes";
import { adaptarAlunoParaResponse } from "./aluno.adapter";
import { adaptarTurmaParaResponse } from "./turma.adapter";

export function adaptarContratoParaResponse(d: any): Contrato {

  return {
    id: d.id,
    nomeResponsavel: d.nome_responsavel,
    documentoResponsavel: d.documento_responsavel,
    telefone: d.telefone,
    dataCriacao: d.created_at ? new Date(d.created_at) : undefined,
    dataInicio: d.data_inicio ? new Date(d.data_inicio) : undefined,
    diaPagamento: d.dia_pagamento,
    diasAlternados: d.dias_alternados,
    horarioDiasAlternados: d.horario ? stringToDate(d.horario) : undefined,
    ressarcimentoEmFeriados: d.ressarcimento_feriado,
    aluno: adaptarAlunoParaResponse(d.aluno),
    turma: adaptarTurmaParaResponse(d.turma),
    dataFim: d.dataFim,
    diasDasAulas: d.dias_aulas?.map((aula: any) => ({
      id: aula.id,
      diaSemana: DiasDaSemana[aula.dia_semana],
      horario: aula.horario
    })),
    valorPagamento: d.valor_pagamento,
    autorizaUsoDeImagem: d.uso_imagem,
    situacao: SituacoesTurmaPorId[d.situacao]
  };
}


export function adapterContratoParaRequest(d: Contrato): any {
  const request: any = {
    documento_responsavel: d.documentoResponsavel,
    data_inicio: d.dataInicio.toISOString().split('T')[0],
    dia_pagamento: d.diaPagamento,
    valor_pagamento: d.valorPagamento,
    uso_imagem: d.autorizaUsoDeImagem,
    nome_responsavel: d.nomeResponsavel,
    ressarcimento_feriado: d.ressarcimentoEmFeriados,
    dias_alternados: d.diasAlternados,
    telefone: d.telefone,
    turma: d.turma.id,
    aluno: d.aluno.id
  }
  if (d.diasAlternados) {
    request.horario = d.horarioDiasAlternados.toString().slice(16, 21)
  }

  return request
}





function stringToDate(timeString: string): Date {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
}