import { Contrato } from "../../interfaces/contrato";
import { Aluno } from "../../model/Alunos";
import { DiasDaSemana } from "../Enums/enumDiasDaSemana";
import { Situacoes } from "../Enums/enumSituacoes";

export function adaptarContratoParaResponse(d: any): Contrato {
  return {
    id: d.id,
    nomeResponsavel: d.nomeResponsavel,
    documentoResponsavel: d.documentoResponsavel,
    telefone: d.telefone,
    aluno: d.alunoId,
    dataCriacao: d.dataCriacao,
    dataInicio: d.dataInicio,
    dataFim: d.dataFim,
    diasDasAulas: d.diasDasAulas.map((aula: any) => ({
        id: aula.id,
        diaSemana: DiasDaSemana[aula.diaSemana],
        horario: aula.horario
    })),
    valorPagamento: d.valorPagamento,
    diaPagamento: d.diaPagamento,
    horarioDiasAlternados: d.horarioDiasAlternados,
    diasAlternados: d.diasAlternados,
    ressarcimentoEmFeriados: d.ressarcimentoEmFeriados,
    autorizaUsoDeImagem: d.autorizaUsoDeImagem,
    situacao: Situacoes[d.situacao]
  };
}


export function adapterContratoParaRequest(d: Contrato): any{
  const request: any = {
    documentoResponsavel: d.documentoResponsavel,
    aluno: {
      id: d.aluno.id,
      nome: d.aluno.nome,
      dataNascimento: d.aluno.dataNascimento.toISOString().split('T')[0],
      sexo: d.aluno.sexo
    },
    dataInicio: d.dataInicio.toISOString().split('T')[0],
    diaPagamento: d.diaPagamento,
    valorPagamento: d.valorPagamento,
    autorizaUsoDeImagem: d.autorizaUsoDeImagem,
    nomeResponsavel: d.nomeResponsavel,
    ressarcimentoEmFeriados: d.ressarcimentoEmFeriados,
    diasAlternados: d.diasAlternados,
    telefone: d.telefone,
  }

  if (d.diasDasAulas && d.diasDasAulas.length > 0) {
    request.diasDasAulas = d.diasDasAulas.map((dia: any) => ({
      id: dia.id,
      horario: dia.horario,
      diaSemana: dia.diaSemana
    }));
  }
  if(d.diasAlternados){
    request.horarioDiasAlternados = d.horarioDiasAlternados.toString().slice(16, 21)
    console.log(request.horarioDiasAlternados)
  }

 return request
}

function gerarIniciais(nome: string):string{
      if (!nome) return '';
        let partes = nome.trim().split(/\s+/);
        if (partes.length < 2) {
            let inicialApenasUmNome = partes[0][0].toUpperCase();
            return inicialApenasUmNome;
        }
        let inicialPrimeiroNome = partes[0][0].toUpperCase();
        let inicialUltimoNome = partes [partes.length -1][0].toUpperCase();
        return  inicialPrimeiroNome + inicialUltimoNome;
    }

