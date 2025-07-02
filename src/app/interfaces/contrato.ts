import { Aluno } from "./aluno";
import { Aula } from "./aula";

export interface Contrato{
      id?: Number;  
      nomeResponsavel: string;
      documentoResponsavel: string;
      telefone: string;
      aluno: Aluno;
      dataCriacao?: Date;
      dataInicio: Date;
      dataFim?: Date;
      diasDasAulas?: Aula[];
      valorPagamento: Number;
      diaPagamento: Number;
      situacao?: string;
      diasAlternados: boolean;
      ressarcimentoEmFeriados: Boolean;
      autorizaUsoDeImagem: Boolean;

      horarioDiasAlternados?: string;
}

