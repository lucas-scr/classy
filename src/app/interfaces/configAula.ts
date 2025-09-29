import { DiasDaSemana } from "../shared/Enums/enumDiasDaSemana";

export interface ConfigAula{
    id?: number;
    diaSemana: DiasDaSemana;
    horario: string;
    contrato_id?: number;
}

