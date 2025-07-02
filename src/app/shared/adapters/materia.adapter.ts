import { Materia } from "../../interfaces/materias";

export function adaptarMateriaResponse(m: any): Materia {
    return {
        id: m.id,
        nome: m.nome
    }
}
