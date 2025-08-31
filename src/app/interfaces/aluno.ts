import { Contrato } from "./contrato";

export interface Aluno{
    dataNascimento: Date;
    id?: number;
    nome: string;
    idade?: number;
    iniciais?: string;
    sexo: string;
    contrato?:  Partial<Contrato> | null;
}