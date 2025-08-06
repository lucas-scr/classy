import { Turma } from "../../interfaces/turma";

export function adaptarTurmaParaResponse(data: any): Turma {
    return {
        id: data.id,
        nome: data.nome,
        situacao: data.situacao,
        user_id: data.user_id
    };
}

export function adaptarTurmaParaRequest(data: Turma): any {
    const request: any = {
        id: data.id,
        nome: data.nome,
        situacao: data.situacao,
        user_id: data.user_id
    }
    return request
}