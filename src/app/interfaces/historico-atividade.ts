
export interface HistoricoAtividade{
    id?: number;
    aluno_id?: number;
    codigo_atividade: string;
    materia: string;
    nome_atividade: string;
    descricao?: string
    data_criacao: Date;
}