import { Aluno } from "./aluno";
import { Aula } from "./aula";
import { Turma } from "./turma";

export interface Contrato{
      id?: number;  
      nomeResponsavel: string;
      documentoResponsavel: string;
      telefone: string;
      aluno_id?: number;
      aluno: Aluno
      dataCriacao?: Date;
      dataInicio: Date;
      dataFim?: Date;
      diasDasAulas?: Aula[];
      valorPagamento: number;
      diaPagamento: number;
      situacao?: string;
      diasAlternados: boolean;
      ressarcimentoEmFeriados: Boolean;
      autorizaUsoDeImagem: Boolean;
      horarioDiasAlternados?: string;
      turma_id?: number;
      turma: Turma;
}

