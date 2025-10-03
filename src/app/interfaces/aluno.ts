import { Contrato } from "./contrato";
import { HistoricoAtividade } from "./historico-atividade";

export interface Aluno{
    dataNascimento: Date;
    id?: number;
    nome: string;
    idade?: number;
    iniciais?: string;
    sexo: string;
    contrato?:  Partial<Contrato> | null;
    historico_atividades?: HistoricoAtividade[];
}