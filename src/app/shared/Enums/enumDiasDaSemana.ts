export enum DiasDaSemana {
  DOMINGO = 'DOMINGO',
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO'
}

// Mapeamento dos nomes amigáveis
export const DiasDaSemanaDescricao: Record<DiasDaSemana, string> = {
  [DiasDaSemana.DOMINGO]: 'Domingo',
  [DiasDaSemana.SEGUNDA]: 'Segunda',
  [DiasDaSemana.TERCA]: 'Terça',
  [DiasDaSemana.QUARTA]: 'Quarta',
  [DiasDaSemana.QUINTA]: 'Quinta',
  [DiasDaSemana.SEXTA]: 'Sexta',
  [DiasDaSemana.SABADO]: 'Sábado'
};