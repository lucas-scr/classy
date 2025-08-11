import { Atividade } from "../../interfaces/atividades";

export function adaptarAtividadeParaResponse(data: any): Atividade {
         console.log(data)
    return {
        id: data.id,
        codigo: data.codigo,
        materia_id: data.materia,
        nome_materia: data.materia.nome,
        url: data.url,
        descricao: data.descricao,
        extensao: data.extensao,
        user_id: data.user_id,
        data_criacao: data.created_at,
        arquivo_anexado: data.arquivo_anexado
    };
}

export function adaptarAtividadeParaRequest(data: Atividade): any {
    console.log(data)
    const request: any = {
        id: data.id,
        codigo: data.codigo,
        materia: data.materia_id,
        url: data.url,
        descricao: data.descricao,
        extensao: data.extensao,
        user_id: data.user_id,
        created_at: data.data_criacao,
        arquivo_anexado: data.arquivo_anexado
    }
    return request
}