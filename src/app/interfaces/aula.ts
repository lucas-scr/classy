import { Aluno } from '../interfaces/aluno'

export interface Aula{
    id?: number;
    aluno?: Aluno | undefined;
    data: Date;
    situacao: number;
    contrato_id?: number | undefined;
}



export interface AulasPorIntervalo{
    data: Date;
    aulas: Aula[];
}