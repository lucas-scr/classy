import { DiasDaSemana } from "../shared/Enums/enumDiasDaSemana";

export interface Aula{
    id?: number;
    diaSemana: DiasDaSemana;
    horario: string;
}