import { Turma } from "../../interfaces/turma";

export function adaptarTurmaParaResponse(data: any): Turma {
    return {
        id: data.id,
        nome: data.nome,
        situacao: data.situacao,
    };
}

export function adaptarTurmaParaRequest(data: Turma): any {
    const request: any = {
        nome: data.nome,
        situacao: data.situacao
    }

    return request
}