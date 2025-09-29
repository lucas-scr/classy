import { Aluno } from "./aluno";
import { ConfigAula } from "./configAula";
import { Turma } from "./turma";

export interface Contrato{
      id?: number;  
      nomeResponsavel: string;
      documentoResponsavel: string;
      telefone: string;
      aluno: Aluno
      dataCriacao?: Date;
      dataInicio: Date;
      dataFim?: Date;
      diasDasAulas?: ConfigAula[];
      valorPagamento: number;
      diaPagamento: number;
      situacao?: string;
      diasAlternados: boolean;
      ressarcimentoEmFeriados: Boolean;
      autorizaUsoDeImagem: Boolean;
      horarioDiasAlternados?: string | Date;
      turma: Turma;
}

