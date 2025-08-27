import { Contrato } from "../../interfaces/contrato";
import { Aluno } from "../../model/Alunos";
import { DiasDaSemana } from "../Enums/enumDiasDaSemana";
import { Situacoes, SituacoesTurmaPorId } from "../Enums/enumSituacoes";

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
    horarioDiasAlternados: d.horario,
    ressarcimentoEmFeriados: d.ressarcimento_feriado,
    aluno: {
      id: d.aluno.id,
      nome: d.aluno.nome,
      dataNascimento: d.aluno.data_nascimento,
      sexo: d.aluno.sexo,
      idade: gerarIdade(d.aluno.data_nascimento),
      iniciais: gerarIniciais(d.aluno.nome)
    },
      turma: {
      id: d.turma.id,
      nome: d.turma.nome,
      situacao: d.turma.situacao
    },
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
    turma: d.turma_id,
  }
  if (d.diasAlternados) {
    request.horario = d.horarioDiasAlternados.toString().slice(16, 21)
  }

  return request
}

function gerarIniciais(nome: string): string {
  if (!nome) return '';
  let partes = nome.trim().split(/\s+/);
  if (partes.length < 2) {
    let inicialApenasUmNome = partes[0][0].toUpperCase();
    return inicialApenasUmNome;
  }
  let inicialPrimeiroNome = partes[0][0].toUpperCase();
  let inicialUltimoNome = partes[partes.length - 1][0].toUpperCase();
  return inicialPrimeiroNome + inicialUltimoNome;
}


function gerarIdade(dataNascimento?: Date): number | undefined{

  if (!dataNascimento) return undefined

      return Math.floor(
        (Date.now() - new Date(dataNascimento).getTime()) / 
        (1000 * 60 * 60 * 24 * 365)
      );
}