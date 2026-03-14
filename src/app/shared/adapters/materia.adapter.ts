import { Materia } from "../../interfaces/materias";

export function adaptarMateriaResponse(m: any): Materia {
    return {
        id: m.id,
        nome: m.nome,
        dataCriacao: m.created_at,
        ativo: m.ativo
    }
}


export function adaptarMateriaParaRequest(data: Materia): any {
    const request: any = {
        nome: data.nome,
        ativo: data.ativo,
        created_at: data.dataCriacao
    }

    return request
}