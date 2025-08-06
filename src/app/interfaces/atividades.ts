import { Materia } from "./materias";

export interface Atividade{
    id?: number; 
    codigo: string;
    materia: number;
    arquivo?: Blob;
    url?: string;
    descricao: string;
    data_criacao?: Date;
    nomeArquivo?: string;
    extensao?: string;
    user_id?: string;
}