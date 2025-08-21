import { Contrato } from "../../interfaces/contrato";
import { Aluno } from "../../model/Alunos";
import { DiasDaSemana } from "../Enums/enumDiasDaSemana";
import { Situacoes, SituacoesTurmaPorId } from "../Enums/enumSituacoes";

export function adaptarContratoParaResponse(d: any): Contrato {
  return {
    id: d.id,
    dataCriacao: d.created_at ? new Date(d.created_at) : undefined,
    dataInicio: d.data_inicio ? new Date(d.data_inicio) : undefined,
    diaPagamento: d.dia_pagamento,
    diasAlternados: d.dias_alternados,
    turma_id: d.turma.id,
    nomeResponsavel: d.nome_responsavel,
    documentoResponsavel: d.documento_responsavel,
    horarioDiasAlternados: d.horario,
    telefone: d.telefone,
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
      nome: d.turma.nome,
      situacao: d.turma.situacao
    },
      dataFim: d.dataFim,
      diasDasAulas: d.diasDasAulas?.map((aula: any) => ({
        id: aula.id,
        diaSemana: DiasDaSemana[aula.diaSemana],
        horario: aula.horario
      })),
      valorPagamento: d.valor_pagamento,
      autorizaUsoDeImagem: d.uso_imagem,
      situacao: SituacoesTurmaPorId[d.situacao]
};
}


export function adapterContratoParaRequest(d: Contrato): any {
  const request: any = {
    documentoResponsavel: d.documentoResponsavel,
    aluno_id: d.aluno.id,
    dataInicio: d.dataInicio.toISOString().split('T')[0],
    diaPagamento: d.diaPagamento,
    valorPagamento: d.valorPagamento,
    autorizaUsoDeImagem: d.autorizaUsoDeImagem,
    nomeResponsavel: d.nomeResponsavel,
    ressarcimentoEmFeriados: d.ressarcimentoEmFeriados,
    diasAlternados: d.diasAlternados,
    telefone: d.telefone,
    turma_id: d.turma_id,
  }
  if (d.diasAlternados) {
    request.horarioDiasAlternados = d.horarioDiasAlternados.toString().slice(16, 21)
    console.log(request.horarioDiasAlternados)
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