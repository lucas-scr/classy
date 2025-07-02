import { Materia } from "./materias";

export interface Atividade{
    codigo: string;
    materia: Materia;
    arquivo?: Blob;
    url?: string;
    descricao: string;
    dataCriacao?: Date;
    id?: number;
    nomeArquivo?: string;
    extensao?: string;
}