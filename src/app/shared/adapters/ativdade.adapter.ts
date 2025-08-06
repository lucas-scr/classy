import { Atividade } from "../../interfaces/atividades";

export function adaptarAtividadeParaResponse(data: any): Atividade {
    return {
        id: data.id,
        codigo: data.codigo,
        materia: data.materia,
        url: data.url,
        descricao: data.descricao,
        extensao: data.extensao,
        user_id: data.user_id,
        data_criacao: data.created_at
    };
}

export function adaptarAtividadeParaRequest(data: Atividade): any {
    const request: any = {
        id: data.id,
        codigo: data.codigo,
        materia: data.materia,
        url: data.url,
        descricao: data.descricao,
        extensao: data.extensao,
        user_id: data.user_id,
        created_at: data.data_criacao
    }
    return request
}