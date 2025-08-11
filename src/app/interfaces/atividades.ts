import { Materia } from "./materias";

export interface Atividade{
    id?: number; 
    codigo: string;
    materia_id: number;
    nome_materia: string;
    arquivo?: Blob;
    url?: string;
    imagemPath?: string;
    descricao: string;
    data_criacao?: Date;
    nomeArquivo?: string;
    extensao?: string;
    user_id?: string;
    arquivo_anexado?: boolean;
}